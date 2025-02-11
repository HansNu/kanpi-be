// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');  // Change this
const router = express.Router();
const baseUserUrl = '/user';

//get
router.post(baseUserUrl + '/getUserByUserId', userController.GetUserByUserId);
router.post(baseUserUrl + '/getUserByEmail', userController.GetUserByEmail);


//addEdit
router.post(baseUserUrl + '/addUser', userController.AddUser);  // Reference controller

//transaction
router.post(baseUserUrl + '/login', userController.Login);

module.exports = router;