const express = require('express');
const router = express.Router();
const baseUrl = '/classroomAdmin';
const classroomAdminController = require('../controllers/classroomAdminController');

//get
router.post(baseUrl + '/getAdminByClassroomCodeAndUserId', classroomAdminController.GetAdminByClassroomCodeAndUserId);

//addEdit


//transaction


module.exports = router;