const express = require('express');
const KanbanController = require('../controllers/kanbanController'); 
const router = express.Router();
const baseUrl = '/kanban';

//get
router.post(baseUrl + '/getKanbanById', KanbanController.GetKanbanById);

//addEdit
router.post(baseUrl + '/addKanban', KanbanController.AddKanban);

//transaction

module.exports = router;