const classroomMemberService = require('../services/classroomMemberService');
const classroomService = require('../services/classroomService');
const model = require('../models/index');

class classroomMemberController{

    async GetClassroomMemberByClassroomCode (req, res) {
        const classroomMembers = await classroomMemberService.getClassroomMemberByClassroomCode(req.body);
        
        res.status(200).json({
            data: classroomMembers
        });
    }

    async GetClassroomAdminMemberByClassroomCode(req, res) {
        const classroomAdmin = await classroomMemberService.getClassroomAdminByClassroomCode(req.body);

        res.status(200).json({
            data:classroomAdmin
        });
    }

    async GetClassroomStudentMemberByClassroomCode(req, res){
        const classroomStudent = await classroomMemberService.getClassroomStudentMemberByClassroomCode(req.body);

        res.status(200).json({
            data:classroomStudent
        });
    }

    async JoinClassroom(req, res) {
            const existingClassroom = await classroomService.getClassroomByClassroomCode(req.body); 
            if (existingClassroom == null) {
                res.status(200).json({
                    message: "Invalid Classroom Code"
                })
            }

            const newClassroom = await classroomMemberService.joinClassroom(req.body.classroomCode, req.body.userId, req.body.memberName);
    
            res.status(200).json({
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

    async UpdateMemberRole(req, res) {
        const updatedRole = await classroomMemberService.updateMemberRole(req.body);

        res.status(200).json({
            data: updatedRole
        });
    }
}

module.exports = new classroomMemberController();