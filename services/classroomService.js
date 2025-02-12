const supabase = require('./supabaseClient');
const commonService = require('./commonService');
const model = require('../models/index');

class classroomService {

    async getListClassroom() {
        const { data, error } = await supabase.from('classroom').select('*');
        return data;
    }

    async getListClassroomByUserId(userId){
        
        const {data, error} = await supabase.from('classroom').select('*', ('users:user_id'(user_id))).eq('class_member_id', userId);
        return data;
    }
}

module.exports = new classroomService();