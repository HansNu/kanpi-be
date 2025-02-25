const express = require('express');
const router = express.Router();
const baseUrl = '/classroomAdmin';
const classroomAdminController = require('../controllers/classroomAdminController');

//get
router.post(baseUrl + '/getSuperAdminByClassroomCodeAndUserId', classroomAdminController.GetSuperAdminByClassroomCodeAndUserId);

//addEdit


//transaction


module.exports = router;