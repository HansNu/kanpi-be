const express = require('express');
const classroomSubjectController = require('../controllers/classroomSubjectController'); 
const router = express.Router();
const baseUrl = '/classroomSubject';

//get
router.post(baseUrl + '/getListClassroomSubjectByClassroomCode', classroomSubjectController.GetListClassroomSubjectByClassroomCode);

//addEdit
router.post(baseUrl + '/addClassroomSubjectBySubjectCode', classroomSubjectController.AddClassroomSubjectBySubjectCode);

//transaction

module.exports = router;