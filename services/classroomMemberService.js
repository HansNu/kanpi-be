const supabase = require('./supabaseClient');
const userService = require('../services/userService');
const model = require('../models/index');

class classroomMemberService {

    async joinClassroom(classroomCode, userId, memberName) {
        const memObj = model.classroomMemberObj.toDatabaseFormat({ classroomCode, userId, memberName });
        const { data, error } = await supabase
            .from('classroom_member')
            .insert([
                { classroom_code: memObj.classroom_code, user_id: memObj.user_id, member_name: memObj.member_name},
            ])
            .select('*');
    
        if (error) {
            console.error("Invalid data:", error);
            return null;
        }
    
        return data;
    }
    
    async removeClassroomMemberByCode(req) {
        const { data, error } = await supabase
            .from('classroom_member')
            .delete()
            .match({ 
                member_name: req.memberName, 
                classroom_code: req.classroomCode 
            })
            .select('*');
    
        if (error) {
            console.error("Failed to delete classroom member:", error);
            return null;
        }
        return data;
    }
    


}

module.exports = new classroomMemberService();