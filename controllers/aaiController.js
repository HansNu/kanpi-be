const aaiService = require('../services/aaiService');

class aaiController{

    async AddAai(req, res){
        const aaiObj = await aaiService.addAai(req.body);

        res.status(200).json(aaiObj);
    }

    async EditAai(req, res){
        const aaiObj = await aaiService.editAai(req.body);

        res.status(200).json(aaiObj);
    }

    async DeleteAai(req, res){
        const aaiObj = await aaiService.deleteAai(req.body);

        res.status(200).json(aaiObj);
    }

    async GetGeneralAaiByClassroomCode(req, res) {
        const generalAai = await aaiService.getGeneralAaiByClassroomCode(req.body);

        res.status(200).json(generalAai);
    }

    async GetSubjectAaiByClassroomCode(req, res) {
        const subjectAai = await aaiService.getSubjectAaiByClassroomCode(req.body);

        res.status(200).json(subjectAai);
    }

    async GetSubjectAaiByClassroomCodeAndSubjectCode(req, res){
        const subjectAai = await aaiService.getSubjectAaiBySubjectCodeAndClassroomCode(req.body);

        res.status(200).json(subjectAai);
    }

    async GetAaiByClassroomCode(req, res) {
        const aai = await aaiService.getAaiByClassroomCode(req.body);

        res.status(200).json(aai);
    }

    async GetAaiBySubjectAaiId(req, res){
        const aai = await aaiService.getAaiBySubjectAaiId(req.body);

        res.status(200).json(aai);
    }

    async GetAaiGradesByClassroomCode(req, res) {
        const aaiGrades = await aaiService.getAaiGradesByClassroomCode(req.body);

        res.status(200).json(aaiGrades);
    }

    async GetListGeneralAaiClassroomByUserId(req, res){
        const aai = await aaiService.getListGeneralAaiClassroomByUserId(req.body);

        res.status(200).json(aai);
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