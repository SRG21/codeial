const User = require('../models/user');

module.exports.profile = function(req, res){
    res.render('profile',{
        title: "Your Profile"
    });
}

module.exports.signUp = function(req, res){
    res.render('profile_sign_up', {
        title: "Codial| Sign-Up"
    });
}

module.exports.signIn = function(req, res){
    res.render('profile_sign_in', {
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
    // to do later
}