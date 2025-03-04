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

    async GetAaiByAaiCode(req, res) {
        const aai = await aaiService.getAaiByAaiCode(req.body);

        res.status(200).json(aai);
    }

}

module.exports = new aaiController();