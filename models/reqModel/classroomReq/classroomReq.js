const Joi = require('joi');

class reqAddClassroomObj {
    static validate(data) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            classroomCode: Joi.string().min(3).max(20).required(),
            classroomName: Joi.string().min(3).max(100).required(),
            classroomMemberAmt: Joi.number().integer().default(0),
            classroomStat: Joi.boolean().default(true),
        });

        return schema.validate(data);        
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        return{
            userId: value.userId,
            classroomCode: value.classroomCode,
            classroomName: value.classroomName,
            classroomMemberAmt: value.classroomMemberAmt,
            classroomStat: value.classroomStat
        }
    }
}

module.exports = {reqAddClassroomObj};