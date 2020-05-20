console.log("Setting-up user controller..........")

const User = require('../models/user');
const Post = require('../models/post');

module.exports.profile = function(req, res){
    return res.render('profile',{
        title: "Codial | Your Profile",
    });

    
   

    // populating the user
    /*Post.find({}).populate('user').exec(function(err, posts){ // showing all the posts made on the the profile page itself
        return res.render('profile',{
            title: "Codial | Your Profile",
            posts : posts
        });
    });*/

}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
   
    return res.render('profile_sign_up', {
                title: "Codial| Sign-Up"
            });
}

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }

    return res.render('profile_sign_in', {
        title: "Codial| Sign-In"
    });
}

module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){ // here user is a success variable
        if(err){
            console.log(`Error in checking for user in databse: ${err}`);
            return;
        }

        if(!user){ // no user found
            User.create( req.body, function(err, user){
                if(err){console.log(`Error in creating a user in sign-up`); return;}

                return res.redirect('/profile/sign-in');
            })
        }else { // user already exists
            return res.redirect('back');
        }
    });
}


module.exports.createSession = function(req,res){
    res.redirect('/profile');
}

console.log("user controller setup complete!");

module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/profile/sign-in');
}