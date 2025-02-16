const Joi = require('joi');

class classroomObj {
    static validate(data) {
        const schema = Joi.object({
            classroomCode: Joi.string().min(3).max(20).required(),
            classroomName: Joi.string().min(3).max(100).required(),
            classroomMemberAmt: Joi.number().integer().min(1).default(0),
            classroomStat: Joi.boolean().default(true),
        });

        return schema.validate(data);
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        if (error) {
            throw new Error(error.details[0].message);
        }

        return {
            classroom_code: value.classroomCode,
            classroom_name: value.classroomName,
            classroom_member_amt: value.classroomMemberAmt,
            classroom_stat: value.classroomStat, // Convert to snake_case
        };
    }
}

module.exports = classroomObj;