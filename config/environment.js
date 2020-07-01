const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'sankalp.lbd',
            pass: 'bharatmatakijai'
        }
    },

    google_client_id: "901872106544-9v5s9rnp2kvl8huhi1mal22bgrp8fmac.apps.googleusercontent.com",
    google_client_secret: "PM-JUpJ-E6u5mMYVcPUjh7on",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",

    jwt_secret_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }

} //No need for ./, it would work otherwise aswell

const production = {
    name: 'production',
    asset_path: process.env.CODIAL_ASSET_PATH,
    session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
    db: process.env.CODIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODIAL_GMAIL_USER,
            pass: process.env.CODIAL_GMAIL_PASSWORD
        }
    },

    google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODIAL_GOOGLE_CALL_BACK_URL,

    jwt_secret_key: process.env.CODIAL_JWT_KEY,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}

module.exports = eval(process.env.CODIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODIAL_ENVIRONMENT);
