console.log("User routes loading......................");

const express = require('express');
const router = express.Router();
const passport = require('passport');


const userController = require('../controllers/users-controller');


router.get('/profile/:id', passport.checkAuthentication, userController.profiler); // the address here adds to the address in the router index --->> /profile/
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);

router.post('/create', userController.create);

// use passport as a middleware to create session
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),userController.createSession);

router.get('/sign-out', userController.destroySession);

router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);


console.log("user routes loaded!");
module.exports = router;