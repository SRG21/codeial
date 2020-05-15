const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');



passport.use(new localStrategy({
    usernameField:'email'
},
    function(email,password,done){ // done---> is callback function to passport.js
        // find the user and establish the identity
        User.findOne({email,email}, function(err, user){
            if(err){
                console.log(`Error in finding the user---->passport: ${err}`);
                return done(err);
            }

            if(!user || user.password != password){
                console.log('Invalid Username/ Password');
                return done(null, false); // null----> means no error
            }

            return done(null, user);
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
})

// deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){ // checking in database
        if(err){
            console.log(`Error in finding the user---->passport: ${err}`);
            return done(err);
        }

        return done(null,user);
    });
});

//check if the user is authenticated

passport.checkAuthentication = function(req,res,next){
    // if user loggedin, pass the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed-in
    res.redirect('/profile/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // cpoying data from req.user to res.local
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;