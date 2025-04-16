const express = require('express');
const router = express.Router();
const baseUrl = '/memberGrades';
const classroomMemberGradesController = require('../controllers/classroomMemberGradeController');

router.post(baseUrl + '/getMemberGradeBySubjectCodeAndAaiIdAndMemberId', classroomMemberGradesController.GetMemberGradeBySubjectCodeAndAaiIdAndMemberId);