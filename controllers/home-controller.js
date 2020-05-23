const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    // without population the user
    
    /*Post.find({}, function(err, posts){ // showing all the posts made on the the profile page itself
        return res.render('home',{
            title: "Codial | Home",
            posts : posts
        });
    });*/

    // populating the user

    Post.find({}).populate('user').populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).exec(function(err, posts){ // showing all the posts made on the the profile page itself
        
        User.find({}, function(err,user){
            return res.render('home',{
                title: "Codial | Home",
                posts: posts,
                all_users: user
            });
        });
    });
}