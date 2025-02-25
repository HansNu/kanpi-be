const userService = require('../services/userService');
const classroomService = require('../services/classroomService');
const model = require('../models/index');
const joi = require ('joi');

class classroomController {

    async GetListClassroom (req, res){
        const classrooms = await classroomService.getListClassroom();
        
        res.status(200).json({
            message: "Classroom list retrieved successfully",
            data: classrooms
        });
    }

    async GetListClassroomByUserId (req, res){
        if(req.body.id == 0){
            return res.status(200).json({});
        }
        const reqById = model.reqByIdObj.toDatabaseFormat(req.body);
        const classrooms = await classroomService.getListClassroomByUserId(reqById.id);
        
        res.status(200).json({
            data: classrooms
        });
    }

    async GetClassroomByClassroomCode (req, res){
        const classrooms = await classroomService.getClassroomByClassroomCode(req.body);
        
        res.status(200).json({
            data: classrooms
        });
    }

    async AddClassroom (req, res){
        const classroomData = model.reqAddClassroomObj.toDatabaseFormat(req.body);
        const newClassroom = await classroomService.addClassroom(classroomData, req.userId);
        
        res.status(200).json({
            message: "Classroom added successfully",
            data: newClassroom
        });
    }

    async DeleteClassroom (req, res){
        const reqByCode = model.reqByCodeObj.toDatabaseFormat(req.body);
        const deletedClassroom = await classroomService.deleteClassroom(reqByCode.code);
        
        res.status(200).json({
            message: "Classroom deleted successfully",
            data: deletedClassroom
        });
    }

    async GenerateClassroomCode(req, res) {
        const classroomCode = await classroomService.generateClassroomCode();
        
        res.status(200).json({
            data: classroomCode
        });
    }
}

module.exports = new classroomController();