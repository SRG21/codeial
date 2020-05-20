const Post = require('../models/post');

module.exports.home = function(req, res){
    // without population the user
    
    /*Post.find({}, function(err, posts){ // showing all the posts made on the the profile page itself
        return res.render('home',{
            title: "Codial | Home",
            posts : posts
        });
    });*/

    // populating the user

    Post.find({}).populate('user').exec(function(err, posts){ // showing all the posts made on the the profile page itself
        return res.render('home',{
            title: "Codial | Home",
            posts : posts
        });
    });
}