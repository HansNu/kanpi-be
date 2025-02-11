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
}

module.exports = new classroomController();