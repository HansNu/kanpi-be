const express = require('express');
const router = express.Router();
const baseUrl = '/aai';
const aaiController = require('../controllers/aaiController');

//get
router.post(baseUrl + '/getGeneralAaiByClassroomCode', aaiController.GetGeneralAaiByClassroomCode);
router.post(baseUrl + '/getAaiByAaiCode', aaiController.GetAaiByAaiCode);

//addEdit
router.post(baseUrl + '/addAai', aaiController.AddAai);


//transaction


module.exports = router;