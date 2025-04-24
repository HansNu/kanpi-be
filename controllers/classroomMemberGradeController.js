const classroomMemberGrades = require('../services/classroomMemberGradesService');
const model = require('../models/index');

class classroomMemberGradesController {

    async GetMemberGradeByAaiIdAndMemberId(req, res){
        const memberGrades = await classroomMemberGrades.getMemberGradeByAaiIdAndMemberId(req.body);

        res.status(200).json(memberGrades);
    }
    
    async GetGeneralStudentGrades(req, res){
        const memberGrades = await classroomMemberGrades.getGeneralStudentGrades(req.body);

        res.status(200).json(memberGrades);
    }

    async GetSubjectStudentGrades(req, res){
        const memberGrades = await classroomMemberGrades.getSubjectStudentGrades(req.body);

        res.status(200).json(memberGrades);
    }

    async AddStudentGradeScore(req, res){
        const memberGrades = await classroomMemberGrades.addStudentGradeScore(req.body);

        res.status(200).json(memberGrades);
    }


}

module.exports = new classroomMemberGradesController();
