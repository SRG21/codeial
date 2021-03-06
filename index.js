const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); // to include layouts, should be used before routes
const db = require('./config/mongoose');


// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportlocal = require('./config/passport-local-startegy');
const passportJWT = require('./config/passport-jwt-strategy'); 
const passportGoogle = require('./config/passport-google-oauth2-strategy'); 
const MongoStore = require('connect-mongo')(session); // used to provide storage of cookies in server other-wise all the session cookies are deleted on server restart
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//Setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat Server is listening on port 5000"); 


const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({ // the conversion should take place before the server starts
        src: path.join(__dirname , env.asset_path , 'scss'),
        dest: path.join(__dirname , env.asset_path , 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    })); // the css files will appear when the page is loaded in the browser and not when server is started after new scss creation
}



app.use(express.urlencoded({extended:false})); // parser
app.use(cookieParser());

//app.use(express.static('./assets')); static content loader, used till testing environment
app.use(express.static(env.asset_path));// In production

app.use('/uploads', express.static(__dirname + '/uploads')); //directory of uploads connected to a route called /upload

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract styles and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'codial',
    // CHANGED :: The secret key in production
    secret: env.session_cookie_key,
    saveUninitialized: false, // dont store additional data in cookie until session is not initialized
    resave: false, // if the user data is already stored do I need to re-write it again 
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

