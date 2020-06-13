console.log("Router Loading..............");

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home-controller');

router.get('/', homeController.home);
router.use('/users', require('./user-profile')); // changed as in users controller /:id wasnt working
router.use('/posts', require('./user-posts'));
router.use('/comments', require('./user-comments'));

router.use('/api', require('./api'));


console.log("Router Loaded!");

module.exports = router;
