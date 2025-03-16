const classroomSubjectService = require('../services/classroomSubjectService');

class classroomSubjectController {

    async GetListClassroomSubjectByClassroomCode(req, res) {
        const classrooms = await classroomSubjectService.getListClassroomSubjectByClassroomCode(req.body);
        
        res.status(200).json({
            data: classrooms
        });
    }

    async AddClassroomSubjectBySubjectCodeAndSubjectName(req, res) {
        const classrooms = await classroomSubjectService.addClassroomSubjectBySubjectCodeAndSubjectName(req.body);
        
        res.status(200).json({
            data: classrooms
        });
    }

    async DeleteClassroomSubjectBySubjectCodeAndSubjectName(req, res) {
        const classrooms = await classroomSubjectService.deleteClassroomSubjectBySubjectCodeAndSubjectName(req.body);
        
        res.status(200).json({
            data: classrooms
        })
    }



}

module.exports = new classroomSubjectController();