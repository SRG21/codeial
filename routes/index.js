console.log("Router Loading..............");

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home-controller');

router.get('/', homeController.home);
router.use('/profile', require('./user-profile'));

console.log("Router Loaded!");

module.exports = router;
