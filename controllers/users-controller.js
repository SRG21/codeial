console.log("Setting-up user controller..........")

const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

//Loads profile page
module.exports.profiler = function(req, res){
    User.findById(req.params.id, function(err,user){
        return res.render('profile',{
            title: "Codial | Your Profile",
            profile_user: user
        });
    });
}

//Loads profile---> Temperorary
module.exports.profile = function(req, res){
        return res.render('profiletemp',{
            title: "Codial | Your Profile",
            //user: user
        });
}

// module.exports.update = function(req,res){
//     if(req.user.id == req.params.id){
//          // imp check ----> otherwise anyone with an id of other user could use inspect to edit someone elses's profile

//          User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             return res.redirect('back');
//          });
//     } else{
//         return res.status(401).send('unauthorized');
//     }
// }

module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){ //if an avatar already exists then it is removed 
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// Loads Sign-Up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
   
    return res.render('profile_sign_up', {
                title: "Codial| Sign-Up"
            });
}

//Loads Sign-In page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
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
            console.log(`Error in checking for user in database: ${err}`);
            return;
        }

        if(!user){ // no user found
            User.create( req.body, function(err, user){
                if(err){console.log(`Error in creating a user in sign-up`); return;}

                return res.redirect('/users/sign-in');
            })
        }else { // user already exists
            return res.redirect('back');
        }
    });
}


module.exports.createSession = function(req,res){
    req.flash('success', 'Logged-in successfully!');
    res.redirect('/');
}


module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success', 'You have been Logged-out!');
    return res.redirect('/',);
}

console.log("user controller setup complete!");