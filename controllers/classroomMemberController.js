const classroomMemberService = require('../services/classroomMemberService');
const classroomService = require('../services/classroomService');
const model = require('../models/index');

class classroomMemberController{

    async JoinClassroom(req, res) {
            const existingClassroom = await classroomService.getClassroomByClassroomCode(req.body); 
            if (existingClassroom == null) {
                res.status(200).json({
                    message: "Invalid Classroom Code"
                })
            }

            const newClassroom = await classroomMemberService.joinClassroom(req.body.classroomCode, req.body.userId, req.body.memberName);
    
            res.status(200).json({
                message: "Classroom joined successfully",
                data: newClassroom
            });
    }

    async RemoveClassroomMemberByCode(req, res) {
        const removedClassroom = await classroomMemberService.removeClassroomMemberByCode(req.body);
        
        res.status(200).json({
            message: "Classroom member removed successfully",
            data: removedClassroom
        });
    }
}

module.exports = new classroomMemberController();