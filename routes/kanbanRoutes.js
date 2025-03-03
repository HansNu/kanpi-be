const express = require('express');
const KanbanController = require('../controllers/kanbanController'); 
const router = express.Router();
const baseUrl = '/kanban';

//get
router.post(baseUrl + '/getKanbanById', KanbanController.GetKanbanById);

//addEdit
router.post(baseUrl + '/addKanban', KanbanController.AddKanban);

//transaction
router.post(baseUrl + '/updateKanbanToInProgress', KanbanController.UpdateKanbanToInProgress);
router.post(baseUrl + '/updateKanbanToDone', KanbanController.UpdateKanbanToDone);
router.post(baseUrl + '/deleteKanban', KanbanController.DeleteKanban);
router.post(baseUrl + '/getListKanbanByUserId', KanbanController.GetListKanbanByUser);
router.post(baseUrl + '/getListKanbanByUserIdAndMonth', KanbanController.GetListKanbanByUserAndMonth);


module.exports = router;