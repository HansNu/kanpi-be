const classroomMemberGrades = require('../services/classroomMemberGradesService');
const model = require('../models/index');

class classroomMemberGradesController {

    async GetMemberGradeBySubjectCodeAndAaiIdAndMemberId(req, res){
        const memberGrades = await classroomMemberGrades.getMemberGradeBySubjectCodeAndAaiIdAndMemberId(req.body);

        res.status(200).json(memberGrades);
    }

    async AddMemberGradeScore(req, res){
        const memberGrades = await classroomMemberGrades.addStudentGradeScore(req.body);

        res.status(200).json(memberGrades);
    }

}

module.exports = new classroomMemberGradesController();
