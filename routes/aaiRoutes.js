const express = require('express');
const router = express.Router();
const baseUrl = '/aai';
const aaiController = require('../controllers/aaiController');

//get
router.post(baseUrl + '/getGeneralAaiByClassroomCode', aaiController.GetGeneralAaiByClassroomCode);
router.post(baseUrl + '/getAaiByAaiCode', aaiController.GetAaiByAaiCode);
router.post(baseUrl + '/getAaiGrades', aaiController.GetAaiGrades);

//addEdit
router.post(baseUrl + '/addAai', aaiController.AddAai);
router.post(baseUrl + '/addAaiGrade', aaiController.AddAaiGrade);


//transaction


module.exports = router;