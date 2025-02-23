const supabase = require('./supabaseClient');
const model = require('../models/index');


class classroomAdminService {

    async getAdminByClassroomCodeAndUserId(req) {
        const { data, error } = await supabase.from('classroom_admin').select('*').eq('classroom_code', req.classroomCode).eq('user_id', req.userId);
        if (data == null || data.length == 0) {
            return {
                message : `Classroom does not exists or there are no admins in classroom with code ${classroomCode}`
            }
        }

        return data;
    }

}

module.exports = new classroomAdminService();