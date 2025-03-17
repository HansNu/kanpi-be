const express = require('express');
const KanbanController = require('../controllers/kanbanController'); 
const kanbanController = require('../controllers/kanbanController');
const router = express.Router();
const baseUrl = '/kanban';

//get
router.post(baseUrl + '/getKanbanById', KanbanController.GetKanbanById);
router.post(baseUrl + '/getListKanbanByUserId', KanbanController.GetListKanbanByUser);
router.post(baseUrl + '/getListKanbanByUserIdAndMonth', KanbanController.GetListKanbanByUserAndMonth);
router.post(baseUrl + '/getListKanbanByUserAndClassroom', KanbanController.GetListKanbanByUserAndClassroom);

//addEdit
router.post(baseUrl + '/addKanban', KanbanController.AddKanban);
router.post(baseUrl + '/editKanban', kanbanController.EditKanban);

//transaction
router.post(baseUrl + '/updateKanbanToInProgress', KanbanController.UpdateKanbanToInProgress);
router.post(baseUrl + '/updateKanbanToDone', KanbanController.UpdateKanbanToDone);
router.post(baseUrl + '/deleteKanban', KanbanController.DeleteKanban);


module.exports = router;