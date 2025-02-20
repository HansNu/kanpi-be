const supabase = require('./supabaseClient');
const userService = require('../services/userService');
const model = require('../models/index');

class classroomMemberService {

    async joinClassroom(classroomCode, userId, memberName) {
        
        const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
            *,
            classroom_member:classroom_member!left(
            classroom_code, member_name
            ),
            classroom_admin:classroom_admin!left(
            classroom_code, admin_name
            )
        `)
        .eq('user_id', userId)
        .eq('name', memberName)
        .single();

        if (userError || !userData) {
        return { message: "User not found" };
        }

        const isMember = userData.classroom_member && userData.classroom_member.some(
        (cm) => cm.classroom_code === classroomCode
        );
        const isAdmin = userData.classroom_admin && userData.classroom_admin.some(
        (ca) => ca.classroom_code === classroomCode
        );

        if (isMember) {
        return { message: `User ${memberName} already exists in this classroom` };
        }
        if (isAdmin) {
        return { message: `User ${memberName} already exists as an admin of this classroom` };
        }

        const memObj = model.classroomMemberObj.toDatabaseFormat({ classroomCode, userId, memberName });

        // Insert the new classroom member.
        const { data, error } = await supabase
        .from('classroom_member')
        .insert([{
            classroom_code: memObj.classroom_code,
            user_id: memObj.user_id,
            member_name: memObj.member_name,
        }])
        .select('*');

        if (error) {
        console.error("Error inserting user into classroom:", error);
        return { message: "Error inserting user into classroom" };
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