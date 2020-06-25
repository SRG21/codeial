const Comment = require('../models/comment');
const Post = require('../models/post');

const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

// Without using async await

/*module.exports.create = function(req,res){
    Post.findById(req.body.post, function(err, post){
        Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id,
        }, function(err, comment){
            if(err){
                console.log("Error in adding comments");
                return;
            }
            post.comments.push(comment);
            post.save();
            

            res.redirect('/');
        });
   });
}*/

// with async await

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);

            if(post){
                // Previous glitch: let comment lead to errors
                var comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id,
                });
                post.comments.push(comment);
                post.save();
                comment = await comment.populate('user', 'name email').execPopulate();
                console.log('creted comment',comment)

                //commentsMailer.newComment(comment); moved to comment_email_workers

                let job = queue.create('emails', comment).save(function(err){
                    if(err){
                        console.log("Error in creating a queue", err);
                        return;
                    }

                    console.log("job enqueued: ",job.id);
                });


            }
                // conversion to ajax
                if(req.xhr){

                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Comment created!"
                    });
                }
               
                req.flash('success', 'Comment Published!');
                return res.redirect('back');

    } catch(err){
        console.log("Error in adding comments", err);
        return res.redirect('back');
    }
    
}

// without async await

// module.exports.destroy = function(req,res){
//     Comment.findById(req.params.id, function(err, comment){
//         if(comment.user == req.user.id){
            
//             let postID = comment.post;
//             comment.remove();

//             Post.findByIdAndUpdate(postID, {$pull: {comments: req.params.id}}, function(err,post){
//                 return res.redirect('back');
//             });
//         }else {
//             return res.redirect('back');
//         }
//     });
// }

//with async await

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            
            let postID = comment.post;
            comment.remove();

            let post = Post.findByIdAndUpdate(postID, {$pull: {comments: req.params.id}});

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "post deleted!"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized!')
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return;
    }
}