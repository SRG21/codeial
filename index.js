const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts'); // to include layouts, should be used before routes
const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportlocal = require('./config/passport-local-startegy'); 



app.use(express.urlencoded()); // parser
app.use(cookieParser());
app.use(express.static('./assets')); // static content loader
app.use(expressLayouts);

app.use(session({
    name: 'codial',
    // TODO change the secret key in production
    secret: 'blasomething',
    saveUninitialized: 'false', // dont store additional data in cookie until session is not initialized
    resave: 'false', // if the user data is already stored do I need to re-write it again 
    cookie: { // for timeout
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// extract styles and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use('/', require('./routes')); // loading router

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if(err){
        console.log(`Error in starting up the server: ${err}`);
    }

    console.log(`the server is up and running on port: ${port}`);
})

