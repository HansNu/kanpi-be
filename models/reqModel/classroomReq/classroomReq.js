const Joi = require('joi');

class reqAddClassroomObj {
    static validate(data) {
        const schema = Joi.object({
            id: Joi.string().required(),
        });

        return schema.validate(data);        
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        return{
            id: value.id
        }
    }
}