const Joi = require('joi');

class ClassroomAdminObj {
    static validate(data) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            adminName: Joi.string().min(3).max(100).required(),
            classroomCode: Joi.string().min(1).required(),
            joinDate: Joi.date().default(() => new Date(), 'current date'),
            adminActive: Joi.boolean().default(true),
            createdAt: Joi.date().default(() => new Date(), 'current timestamp'),
            role: Joi.string().min(1).default('Admin'),
        });

        return schema.validate(data);
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        if (error) {
            throw new Error(error.details[0].message);
        }

        return {
            user_id: value.userId,
            admin_name: value.adminName,
            classroom_code: value.classroomCode,
            join_date: value.joinDate,
            admin_active: value.adminActive,
            created_at: value.createdAt,
            role: value.role
        };
    }
}

module.exports = ClassroomAdminObj;
