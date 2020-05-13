const express = require('express');
const router = express.Router();

const userController = require('../controllers/users-controller');

router.get('/', userController.profile); // the address here adds to the address in the router index --->> /profile/
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);

router.post('/create', userController.create);

module.exports = router;