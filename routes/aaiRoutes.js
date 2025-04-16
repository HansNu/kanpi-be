const express = require('express');
const router = express.Router();
const baseUrl = '/aai';
const aaiController = require('../controllers/aaiController');

//get
router.post(baseUrl + '/getGeneralAaiByClassroomCode', aaiController.GetGeneralAaiByClassroomCode);
router.post(baseUrl + '/getAaiByClassroomCode', aaiController.GetAaiByClassroomCode);
router.post(baseUrl + '/getAaiGradesByClassroomCode', aaiController.GetAaiGradesByClassroomCode);
router.post(baseUrl + '/getAaiBySubjectAaiId', aaiController.GetAaiBySubjectAaiId);
router.post(baseUrl + '/getSubjectAaiByClassroomCode', aaiController.GetSubjectAaiByClassroomCode);
router.post(baseUrl + '/getSubjectAaiByClassroomCodeAndSubjectCode', aaiController.GetSubjectAaiByClassroomCodeAndSubjectCode)

//addEdit
router.post(baseUrl + '/addAai', aaiController.AddAai);
router.post(baseUrl + '/editAai', aaiController.EditAai);
router.post(baseUrl + '/editAaiGrade', aaiController.EditAaiGrade);
router.post(baseUrl + '/addAaiGrade', aaiController.AddAaiGrade);


//transaction
router.post(baseUrl + '/deleteAaiGrade', aaiController.DeleteAaiGrade);
router.post(baseUrl + '/deleteAai', aaiController.DeleteAai);


module.exports = router;