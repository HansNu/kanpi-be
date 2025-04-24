const express = require('express');
const router = express.Router();
const baseUrl = '/classroomAdmin';
const classroomAdminController = require('../controllers/classroomAdminController');

router.post(baseUrl + '/getAdminByClassroomCodeAndUserId', classroomAdminController.GetAdminByClassroomCodeAndUserId);





module.exports = router;