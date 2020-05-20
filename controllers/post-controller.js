const Post = require('../models/post');

module.exports.create = function(req,res){
    console.log(req.body);
    Post.create({
        content: req.body.content,
        user: req.user._id // this is where I went wrong, I did req.body._id
    },function(err, post){
        if(err){
            console.log(`error in creating a post!`);
            return;
        }
        return res.redirect('back');
    });
}