const classroomSubjectService = require('../services/classroomSubjectService');

class classroomSubjectController {

    async GetListClassroomSubjectByClassroomCode(req, res) {
        const classrooms = await classroomSubjectService.getListClassroomSubjectByClassroomCode(req.body);
        
        res.status(200).json({
            data: classrooms
        });
    }

    async AddClassroomSubjectBySubjectCode(req, res) {
        const classrooms = await classroomSubjectService.addClassroomSubjectBySubjectCode(req.body);
        
        res.status(200).json({
            data: classrooms
        });
    }

}

module.exports = new classroomSubjectController();