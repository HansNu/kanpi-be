const express = require('express');
const KanbanController = require('../controllers/kanbanController'); 
const kanbanController = require('../controllers/kanbanController');
const router = express.Router();
const baseUrl = '/kanban';

router.post(baseUrl + '/getKanbanById', KanbanController.GetKanbanById);
router.post(baseUrl + '/getListKanbanByUserId', KanbanController.GetListKanbanByUser);
router.post(baseUrl + '/getListKanbanByUserIdAndMonth', KanbanController.GetListKanbanByUserAndMonth);
router.post(baseUrl + '/getListKanbanByUserAndClassroom', KanbanController.GetListKanbanByUserAndClassroom);
router.post(baseUrl + '/getKanbanByClassroomCode', KanbanController.GetKanbanByClassroomCode);
router.post(baseUrl + '/getKanbanForCalendarByUserIdAndDate', kanbanController.GetKanbanForCalendarByUserIdAndDate);

router.post(baseUrl + '/addKanban', KanbanController.AddKanban);
router.post(baseUrl + '/editKanban', kanbanController.EditKanban);
router.post(baseUrl + '/rejectAllKanbanByUserId', kanbanController.RejectAllKanbanByUserId);
router.post(baseUrl + '/approveAllKanbanByUserId', kanbanController.ApproveAllKanbanByUserId);
router.post(baseUrl + '/rejectKanbanByKanbanId', kanbanController.RejectKanbanByKanbanId);
router.post(baseUrl + '/approveKanbanByKanbanId', kanbanController.ApproveKanbanByKanbanId);


router.post(baseUrl + '/updateKanbanToInProgress', KanbanController.UpdateKanbanToInProgress);
router.post(baseUrl + '/updateKanbanToDone', KanbanController.UpdateKanbanToDone);
router.post(baseUrl + '/deleteKanban', KanbanController.DeleteKanban);
router.post(baseUrl + '/getKanbanCountByUserId', KanbanController.GetKanbanCountByUserId);


module.exports = router;