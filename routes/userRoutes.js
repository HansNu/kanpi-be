// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');  // Change this
const router = express.Router();
const baseUserUrl = '/user';

router.post(baseUserUrl + '/addUser', userController.AddUser);  // Reference controller
router.post(baseUserUrl + '/getUserByUserId', userController.GetUserByUserId);
router.post(baseUserUrl + '/login', userController.Login);

module.exports = router;