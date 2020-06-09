const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); // to include layouts, should be used before routes
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportlocal = require('./config/passport-local-startegy'); 
const MongoStore = require('connect-mongo')(session); // used to provide storage of cookies in server other-wise all the session cookies are deleted on server restart
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({ // the conversion should take place before the server starts
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
})); // the css files will appear when the page is loaded in the browser and not when server is started after new scss creation


app.use(express.urlencoded()); // parser
app.use(cookieParser());
app.use(express.static('./assets')); // static content loader
app.use('/uploads', express.static(__dirname + '/uploads')); //directory of uploads connected to a route called /upload

app.use(expressLayouts);
// extract styles and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'codial',
    // TODO change the secret key in production
    secret: 'blasomething',
    saveUninitialized: 'false', // dont store additional data in cookie until session is not initialized
    resave: 'false', // if the user data is already stored do I need to re-write it again 
    cookie: { // for timeout
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log( err || 'connect mongoDB set ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// Routes
app.use('/', require('./routes')); // loading router


app.listen(port, function(err){
    if(err){
        console.log(`Error in starting up the server: ${err}`);
    }

    console.log(`the server is up and running on port: ${port}`);
});

