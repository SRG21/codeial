const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req,res){
    try{
        //likes/toggle/?=abcdef&type=Post

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            // WRONG -----> req.query._id ---> earlier
            user: req.user.id
        });
        console.log(existingLike)
        //if a like already exists

        if(existingLike){
            console.log('found')
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            
            deleted = true;
        } else{ //make a new like
            console.log('not found')
                let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
            
            deleted = false;
        }

        return res.json(200, {
            message: "Request Successful!",
            data: {
                deleted: deleted
            }
        });

    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error!"
        });
    }
}