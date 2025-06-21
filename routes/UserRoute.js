const express = require("express");
const router = express.Router();
const passport = require('passport');
//middleware import 
const {isLogin,isLogout} = require('../middlewares/auth');
// import model 
const {loadUser,register,login,logout} = require('../controllers/userController');

//conversation route
const {createConvo,getconvo,saveMessages,getmessages,getusers} = require('../controllers/Chats');


router.post('/register',register );
router.post('/login',login );
router.post('/logout/:userId',logout );
router.post('/dashboard',loadUser);

router.post('/create-conversation',createConvo);
router.get('/get-conversation/:userId',getconvo);
router.post('/save-message/',saveMessages);
router.get('/get-message/:conversationid?',getmessages);
router.get('/get-users',getusers);

// Google Authentication Routes
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));




module.exports = router;
