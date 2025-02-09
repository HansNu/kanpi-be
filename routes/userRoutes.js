// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');  // Change this
const router = express.Router();
const baseUserUrl = '/user';

router.post(baseUserUrl + '/addUser', userController.AddUser);  // Reference controller

module.exports = router;