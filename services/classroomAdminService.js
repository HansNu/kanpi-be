const supabase = require('./supabaseClient');
const model = require('../models/index');


class classroomAdminService {

    async getAdminByClassroomCodeAndUserId(req) {
        const { data:superAdmin } = await supabase.from('classroom_admin').select('*').eq('classroom_code', req.classroomCode).eq('user_id', req.userId);
        if (superAdmin == null || superAdmin.length == 0) {
            const {data:admin } = await supabase.from('classroom_member').select('*').eq('classroom_code', req.classroomCode).eq('member_role', 'Admin').eq('user_id', req.userId);

            if(admin == null || admin.length == 0) {
                return {
                    message : `Classroom does not exists or there are no admins in classroom with code ${req.classroomCode}`
                }
                
            } else {
                return admin;
            }
            
        } else {
            return superAdmin;
        }

    }

    async getClassroomSuperAdminByClassroomCode(req) {
        const { data, error } = await supabase.from('classroom_admin').select('*').eq('classroom_code', req.classroomCode);
        if (data == null || data.length == 0) {
            return {
                message : `Classroom does not exists or there are no admins in classroom with code ${req.classroomCode}`
            }
        }
        return data;
    }

    async getClassroomSuperAdminByUserId(req) {
        const {data, error} = await supabase.from('classroom_admin').select('*').eq('user_id', req.userId);
        if(data == null || data.length == 0) {
            return {
                message : `Data not found`
            }
        }

        return data;
    }


}

module.exports = new classroomAdminService();