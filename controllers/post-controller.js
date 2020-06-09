const Post = require('../models/post');
const Comment = require('../models/comment');

/*module.exports.create = function(req,res){
    console.log(req.body);
    Post.create({
        content: req.body.content,
        user: req.user._id // this is where I went wrong, I did req.body._id
    },function(err, post){
        if(err){
            console.log(`error in creating a post!`);
            return;
        }
        req.flash('success', 'Post published!');
        return res.redirect('back');
    });
}*/

module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id // this is where I went wrong, I did req.body._id
        });

        if(req.xhr){
            // Displaying the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();
            
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
        
}

module.exports.destroy = async function(req,res){
    try{ //NOTE:  .id --> returns id as string & ._id--> returns id as object
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();
            await  Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    message: "Post deleted successfully"
                });
            }
            req.flash('success', 'Post and its associated comments deleted!');
            return res.redirect('back');
            
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}