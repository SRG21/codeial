const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts'); // to include layouts, should be used before routes
const db = require('./config/mongoose');



app.use(express.urlencoded()); // parser
app.use(express.static('./assets')); // static content loader
app.use(expressLayouts);

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

