const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codial_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error in connecting to MongoDb"));

db.once('open', function(){
    console.log("Successfully connected to the database :: MongoDB");
});

module.exports = db;
