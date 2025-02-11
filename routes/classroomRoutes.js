const express = require('express');
const classroomController = require('../controllers/classroomController');  // Change this
const router = express.Router();
const baseUserUrl = '/classroom';

//get
router.post(baseUserUrl + '/getListClassroom', classroomController.GetListClassroom);


//addEdit

//transaction

module.exports = router;