const supabase = require('./supabaseClient');
const commonService = require('./commonService');
const model = require('../models/index');

class classroomService {

    async getListClassroom() {
        const { data, error } = await supabase.from('classroom').select('*');
        return data;
    }
}

module.exports = new classroomService();