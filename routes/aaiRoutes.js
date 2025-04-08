const express = require('express');
const router = express.Router();
const baseUrl = '/aai';
const aaiController = require('../controllers/aaiController');

//get
router.post(baseUrl + '/getGeneralAaiByClassroomCode', aaiController.GetGeneralAaiByClassroomCode);
router.post(baseUrl + '/getAaiByClassroomCode', aaiController.GetAaiByClassroomCode);
router.post(baseUrl + '/getAaiGradesByClassroomCode', aaiController.GetAaiGradesByClassroomCode);

//addEdit
router.post(baseUrl + '/addAai', aaiController.AddAai);
router.post(baseUrl + '/editAaiGrade', aaiController.EditAaiGrade);
router.post(baseUrl + '/addAaiGrade', aaiController.AddAaiGrade);


//transaction
router.post(baseUrl + '/deleteAaiGrade', aaiController.DeleteAaiGrade);


module.exports = router;