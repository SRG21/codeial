const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req,res){
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){ 
            return res.json(422, {
                message: "Invalid Username or Password"
            });
        }

        res.json(200, {
            message: "Login successful, please find your token and keep it safe",
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret_key, {expiresIn: 100000})
            }
        });
    }catch(err){
        console.log("Error", err);
        res.json(500, {
            message: "Internal Server Error"
        });
    }
   
}
