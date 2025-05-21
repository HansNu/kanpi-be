// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const baseUserUrl = '/user';

router.post(baseUserUrl + '/getUserByUserId', userController.GetUserByUserId);
router.post(baseUserUrl + '/getUserByEmail', userController.GetUserByEmail);


router.post(baseUserUrl + '/addUser', userController.AddUser);
router.post(baseUserUrl + '/updateUserData', userController.UpdateUserData);
router.post(baseUserUrl + '/forgotPassword', userController.ForgotPassword);

router.post(baseUserUrl + '/login', userController.Login);

module.exports = router;