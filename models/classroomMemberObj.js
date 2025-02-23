const Joi = require('joi');

class classroomMemberObj {
    static validate(data) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            memberName: Joi.string().min(3).max(100).required(),
            classroomCode: Joi.string().min(1),
            memberRole: Joi.string().min(1).default('Member'),
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
            member_name: value.memberName,
            classroom_code: value.classroomCode,
            member_role: value.memberRole, // Convert to snake_case
        };
    }
}

module.exports = classroomMemberObj;