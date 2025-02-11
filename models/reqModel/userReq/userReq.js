const Joi = require('joi');

class reqByIdObj {
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

class reqLoginObj {
    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
        });

        return schema.validate(data);
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        if (error) {
            throw new Error(error.details[0].message);
        }

        return {
            email: value.email,
            password: value.password,
        };
    }
}


module.exports = {reqLoginObj, reqByIdObj};