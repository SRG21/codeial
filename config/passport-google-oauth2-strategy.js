const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

// tell passport to use new strategy google login
passport.use(new googleStrategy({
    clientID: "901872106544-9v5s9rnp2kvl8huhi1mal22bgrp8fmac.apps.googleusercontent.com",
    clientSecret: "PM-JUpJ-E6u5mMYVcPUjh7on",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    function(actionToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log("Error in google-strategy-passport", err); return;}

            console.log(profile);

            if(user){ // if found, set this user as req.user (ie sign-in)

                return done(null, user);
            }else{ // if not found, then create the user and set it as req.user (ie sign-up and sign-in)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, 
                    function(err, user){
                        if(err){console.log("Error in creating user google-strategy passport"); return;}
                        
                        return done(null, user);

                    }
                )
            }

        });
    }
));

module.exports = passport;