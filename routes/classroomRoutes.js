const express = require('express');
const classroomController = require('../controllers/classroomController'); 
const router = express.Router();
const baseUrl = '/classroom';

//get
router.post(baseUrl + '/getListClassroom', classroomController.GetListClassroom);
router.post(baseUrl + '/getListClassroomByUserId', classroomController.GetListClassroomByUserId);
router.post(baseUrl + '/getClassroomByClassroomCode', classroomController.GetClassroomByClassroomCode);


//addEdit
router.post(baseUrl + '/addClassroom', classroomController.AddClassroom);

//transaction
router.post(baseUrl + '/deleteClassroom', classroomController.DeleteClassroom);

module.exports = router;