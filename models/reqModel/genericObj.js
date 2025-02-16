const Joi = require('joi');

class reqByIdObjs  { //gotta replace the one in usersObj with this
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

class reqByCodeObj {
    static validate(data) {
        const schema = Joi.object({
            code: Joi.string().required(),
        });

        return schema.validate(data);        
    }

    static toDatabaseFormat(data) {
        const { error, value } = this.validate(data);

        return{
            code: value.code
        }
    }
}

module.exports = {reqByIdObjs, reqByCodeObj};