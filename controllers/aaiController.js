const aaiService = require('../services/aaiService');

class aaiController{

    async AddAai(req, res){
        const aaiObj = await aaiService.addAai(req.body);

        res.status(200).json(aaiObj);
    }

    async GetGeneralAaiByClassroomCode(req, res) {
        const generalAai = await aaiService.getGeneralAaiByClassroomCode(req.body);

        res.status(200).json(generalAai);
    }

    async GetAaiByClassroomCode(req, res) {
        const aai = await aaiService.getAaiByClassroomCode(req.body);

        res.status(200).json(aai);
    }

    async GetAaiGradesByClassroomCode(req, res) {
        const aaiGrades = await aaiService.getAaiGradesByClassroomCode(req.body);

        res.status(200).json(aaiGrades);
    }

    async AddAaiGrade(req, res) {
        const aaiGrade = await aaiService.addAaiGrade(req.body);

        res.status(200).json(aaiGrade);
    }

    async EditAaiGrade(req, res) {
        const aaiGrade = await aaiService.editAaiGrade(req.body);

        res.status(200).json(aaiGrade);
    }

    async DeleteAaiGrade(req, res) {
        const aaiGrade = await aaiService.deleteAaiGrade(req.body);

        res.status(200).json(aaiGrade);
    }

}

module.exports = new aaiController();