const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const env = require('./environment');
const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: env.jwt_secret_key,
}

passport.use(new JWTstrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id, function(err, user){
        if(err){
            console.log("Error in finding the user from jwt");
            return;
        }

        if(user){
            return done(null, user);
        }else {
            return done(null, false);
        }
    });
}));

module.exports = passport;