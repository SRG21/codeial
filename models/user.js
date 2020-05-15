console.log("Setting up DB Schema................");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);

console.log("DB-Schema set-up completed!");
module.exports = User;