const express = require('express');
const router = express.Router();
const baseUrl = '/memberGrades';
const classroomMemberGradesController = require('../controllers/classroomMemberGradeController');

router.post(baseUrl + '/getMemberGradeByAaiIdAndMemberId', classroomMemberGradesController.GetMemberGradeByAaiIdAndMemberId);
router.post(baseUrl + '/getGeneralStudentGradesByClassCode', classroomMemberGradesController.GetGeneralStudentGrades);
router.post(baseUrl + '/getSubjectStudentGradesByClassCodeAndSubjectCode', classroomMemberGradesController.GetSubjectStudentGrades);

router.post(baseUrl + '/addStudentGradeScore', classroomMemberGradesController.AddStudentGradeScore);

module.exports = router;