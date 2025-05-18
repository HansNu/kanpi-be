const express = require('express');
const classroomSubjectController = require('../controllers/classroomSubjectController'); 
const router = express.Router();
const baseUrl = '/classroomSubject';

router.post(baseUrl + '/getListClassroomSubjectByClassroomCode', classroomSubjectController.GetListClassroomSubjectByClassroomCode);

router.post(baseUrl + '/addClassroomSubjectBySubjectCodeAndSubjectName', classroomSubjectController.AddClassroomSubjectBySubjectCodeAndSubjectName);
router.post(baseUrl + '/deleteClassroomSubjectBySubjectCodeAndClassroomCode', classroomSubjectController.DeleteClassroomSubjectBySubjectCodeAndClassroomCode);


module.exports = router;