const express = require('express');
const classroomController = require('../controllers/classroomController'); 
const router = express.Router();
const baseUrl = '/classroom';

router.post(baseUrl + '/getListClassroom', classroomController.GetListClassroom);
router.post(baseUrl + '/getListClassroomByUserId', classroomController.GetListClassroomByUserId);
router.post(baseUrl + '/getClassroomByClassroomCode', classroomController.GetClassroomByClassroomCode);


router.post(baseUrl + '/addClassroom', classroomController.AddClassroom);
router.post (baseUrl + '/updateClassroomName', classroomController.UpdateClassroomName);

router.post(baseUrl + '/deleteClassroom', classroomController.DeleteClassroom);
router.post(baseUrl + '/generateClassroomCode', classroomController.GenerateClassroomCode);

module.exports = router;