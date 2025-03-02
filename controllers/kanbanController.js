const kanbanService = require('../services/kanbanService');
const joi = require('joi');
const model = require('../models/index');

class KanbanController {

    async GetKanbanById(req, res) {
        const kanbanId = req.body.kanbanId;
        const validation = await kanbanService.getKanbanById(kanbanId);
        res.status(200).json(validation);
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

}

module.exports = new KanbanController();