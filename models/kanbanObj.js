const Joi = require('joi');

class kanbanObj {
    static validate(data) {
        const schema = Joi.object({
            kanbanName: Joi.string().max(255).required(),
            kanbanDescr: Joi.string().max(500).optional().allow(null, ''),
            memberId: Joi.number().integer().required(),
            subjectCode: Joi.string().max(50).required(),
            deadline: Joi.date().required(),
            kanbanStat: Joi.string().max(50).default('Pending'),
            createdDate: Joi.date().default(() => new Date(), 'current timestamp'),
            updateDate: Joi.date().default(() => new Date(), 'current timestamp'),
            createdBy: Joi.string().max(100).required()
        });

        return schema.validate(data);
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        if (error) {
            throw new Error(error.details[0].message);
        }

        return {
            kanban_name: value.kanbanName,
            kanban_descr: value.kanbanDescr,
            member_id: value.memberId,
            subject_code: value.subjectCode,
            deadline: value.deadline,
            kanban_stat: value.kanbanStat,
            created_date: value.createdDate,
            update_date: value.updateDate,
            created_by: value.createdBy,
        };
    }
}

module.exports = kanbanObj;
