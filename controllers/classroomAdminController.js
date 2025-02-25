const classroomAdminService = require('../services/classroomAdminService');
const model = require('../models/index');

class classroomAdminController {

    async GetSuperAdminByClassroomCodeAndUserId(req, res) {
        const classroomAdmin = await classroomAdminService.getSuperAdminByClassroomCodeAndUserId(req.body);
        if (Object.keys(classroomAdmin).length === 1 && classroomAdmin.message) {
            return res.status(200).json({ message: classroomAdmin.message });
        }

        classroomAdmin[0].role = 'SuperAdmin';

        res.status(200).json({
            data: classroomAdmin
        });
    }

}

module.exports = new classroomAdminController();
