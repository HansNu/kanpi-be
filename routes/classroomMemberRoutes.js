const express = require('express');
const router = express.Router();
const baseUrl = '/classroomMember';
const classroomMemberController = require('../controllers/classroomMemberController');

//get
router.post(baseUrl + '/getClassroomMemberByClassroomCode', classroomMemberController.GetClassroomMemberByClassroomCode);

//addEdit

//transaction
router.post(baseUrl + '/joinClassroom', classroomMemberController.JoinClassroom);
router.post(baseUrl + '/removeClassroomMemberByCode', classroomMemberController.RemoveClassroomMemberByCode);

module.exports = router;
