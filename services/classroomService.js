const supabase = require('./supabaseClient');
const commonService = require('./commonService');
const model = require('../models/index');
const userController = require('../controllers/userController');

class classroomService {

    async getListClassroom() {
        const { data, error } = await supabase.from('classroom').select('*');
        return data;
    }

    async getListClassroomByUserId(userId){
        const getUsers = await supabase.from('users').select('*').eq('user_id', userId);

        const getClassroomCode = await supabase
                                .from('classroom_member')
                                .select('classroom_code')
                                .eq('user_id', getUsers.data[0].user_id);

        const {data, error} = await supabase.from('classroom')
                                            .select('*')
                                            .in('classroom_code', getClassroomCode.data.map(({ classroom_code }) => classroom_code))

        return data;
    }
}

module.exports = new classroomService();