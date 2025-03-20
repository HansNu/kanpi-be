const express = require('express');
const router = express.Router();
const baseUrl = '/classroomMember';
const classroomMemberController = require('../controllers/classroomMemberController');

//get
router.post(baseUrl + '/getClassroomMemberByClassroomCode', classroomMemberController.GetClassroomMemberByClassroomCode);
router.post(baseUrl + '/getClassroomAdminByClassroomCode', classroomMemberController.GetClassroomAdminMemberByClassroomCode);
router.post(baseUrl + '/getClassroomStudentMemberByClassroomCode', classroomMemberController.GetClassroomStudentMemberByClassroomCode);
router.post(baseUrl + '/getClassroomMemberByMemberId', classroomMemberController.GetClassroomMemberByMemberId);

//addEdit


//transaction
router.post(baseUrl + '/joinClassroom', classroomMemberController.JoinClassroom);
router.post(baseUrl + '/removeClassroomMemberByCode', classroomMemberController.RemoveClassroomMemberByCode);
router.post(baseUrl + '/updateMemberRole', classroomMemberController.UpdateMemberRole);

module.exports = router;
