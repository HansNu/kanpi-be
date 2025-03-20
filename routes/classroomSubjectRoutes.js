const express = require('express');
const classroomSubjectController = require('../controllers/classroomSubjectController'); 
const router = express.Router();
const baseUrl = '/classroomSubject';

//get
router.post(baseUrl + '/getListClassroomSubjectByClassroomCode', classroomSubjectController.GetListClassroomSubjectByClassroomCode);

//addEdit
router.post(baseUrl + '/addClassroomSubjectBySubjectCodeAndSubjectName', classroomSubjectController.AddClassroomSubjectBySubjectCodeAndSubjectName);
router.post(baseUrl + '/deleteClassroomSubjectBySubjectCodeAndSubjectName', classroomSubjectController.DeleteClassroomSubjectBySubjectCodeAndSubjectName);

//transaction

module.exports = router;