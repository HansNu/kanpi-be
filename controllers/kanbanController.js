const kanbanService = require('../services/kanbanService');
const joi = require('joi');
const model = require('../models/index');

class KanbanController {

    async GetKanbanById(req, res) {
        const kanbanId = req.body.kanbanId;
        const validation = await kanbanService.getKanbanById(kanbanId);
        res.status(200).json(validation);
    }

    async GetListKanbanByUser(req, res){
        const KanbanList = await kanbanService.getListKanbanByUser(req.body.userId);
    
        res.status(200).json(KanbanList);
    }

    async GetListKanbanByUserAndMonth(req, res){
        const KanbanList = await kanbanService.getListKanbanByUserAndMonth(req.body);

        res.status(200).json(KanbanList);
    }

    async GetListKanbanByUserAndClassroom(req, res){
        const KanbanList = await kanbanService.getListKanbanByUserAndClassroom(req.body);
        
        res.status(200).json(KanbanList);
    }

    async AddKanban(req, res) {
        const validation = await kanbanService.addKanban(req.body);
        res.status(200).json(validation);
    }

    async UpdateKanbanToInProgress(req, res) {
        const kanban = await kanbanService.updateKanbanToInProgress(req.body.kanbanId);
        res.status(200).json(kanban);
    }

    async UpdateKanbanToDone(req, res) {
        const kanban = await kanbanService.updateKanbanToDone(req.body.kanbanId);
        res.status(200).json(kanban);
    }

    async DeleteKanban(req, res) {
        const kanban = await kanbanService.deleteKanban(req.body.kanbanId);
        res.status(200).json(kanban);
    }

    async EditKanban(req, res) {
        const kanban =  await kanbanService.editKanban(req.body);
        res.status(200).json(kanban);
    }

    async GetKanbanCountByUserId(req, res) {
        const kanban = await kanbanService.getKanbanCountByUserId(req.body.memberId);
        res.status(200).json(kanban);
    }

    async GetKanbanByClassroomCode(req, res){
        const kanban = await kanbanService.getListKanbanByClassroomCode(req.body);
        res.status(200).json(kanban);
    }

    async RejectAllKanbanByUserId(req, res) {
        const kanban = await kanbanService.rejectAllKanbanByUserId(req.body);
        res.status(200).json(kanban);
    }

    async ApproveAllKanbanByUserId(req, res) {
        const kanban = await kanbanService.approveAllKanbanByUserId(req.body);
        res.status(200).json(kanban);
    }

    async RejectKanbanByKanbanId(req, res){
        const kanban = await kanbanService.rejectKanbanByKanbanId(req.body.kanbanId);
        res.status(200).json(kanban);
    }

    async ApproveKanbanByKanbanId(req, res){
        const kanban = await kanbanService.approveKanbanByKanbanId(req.body.kanbanId);
        res.status(200).json(kanban);
    }

}

module.exports = new KanbanController();