console.log("Router Loading..............");

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home-controller');

router.get('/', homeController.home);
router.use('/profile', require('./user-profile'));
router.use('/posts', require('./user-posts'));


console.log("Router Loaded!");

module.exports = router;
