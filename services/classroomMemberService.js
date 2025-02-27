const supabase = require('./supabaseClient');
const userService = require('../services/userService');
const model = require('../models/index');
const adminService = require('../services/classroomAdminService');

const member = 'member' || 'Member';
const admin = 'admin' || 'Admin';

class classroomMemberService {

    async getClassroomMemberByClassroomCode(req) {
        const { data, error } = await supabase.from('classroom_member').select('*').eq('classroom_code', req.classroomCode);
        const { data: adminData, error: adminError } = await supabase.from('classroom_admin').select('*').eq('classroom_code', req.classroomCode);
        
        if ((data == null || data.length == 0) && (adminData == null || adminData.length == 0)) {
            return {
                message : `Classroom does not exists or there are no members in classroom with code ${req.classroomCode}`
            }
        }

        const getDataSuperAdmin = await adminService.getClassroomSuperAdminByClassroomCode(req);
        const superAdminData = Array.isArray(getDataSuperAdmin) ? getDataSuperAdmin : [];

        const classroomMembers = [...data, ...superAdminData];

        return classroomMembers;
    }

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
        } else if (data == null || data.length == 0) {
            return {
                message : `${req.memberName} not found or has been removed from classroom ${req.classroomCode}`
            }
        } else {
            return{
                data : data,
                message : `${req.memberName} has been removed from classroom ${req.classroomCode}`
            } 
        } 
    }
    
    async getClassroomAdminByClassroomCode(req) {
        const { data, error } = await supabase.from('classroom_member').select('*')
                                .eq('classroom_code', req.classroomCode).eq('member_role', admin);
        if (data == null || data.length == 0) {
            return {
                message : `No Admin found in classroom with code ${req.classroomCode}`
            }
        }
    
        return data;
    }

    async getClassroomStudentMemberByClassroomCode(req) {
        const { data, error } = await supabase.from('classroom_member').select('*')
                                .eq('classroom_code', req.classroomCode).eq('member_role', member);
        if (data == null || data.length == 0) {
            return {
                message : `No Student found in classroom with code ${req.classroomCode}`
            }
        }
    
        return data;
    }

    async updateMemberRole(req) {
        let role = ""; 

        if (req.memberPosition === "Student") {
            role = "Member";
        } else if (req.memberPosition === "Teacher") {
            role = "Admin";
        }

        const { data, error } = await supabase.from('classroom_member')
                                .update({ member_role: role, member_position: req.memberPosition })
                                .eq('classroom_code', req.classroomCode).eq('member_id', req.memberId).select('*');
        if (error ) {
            console.error("Failed to update classroom member role:", error);
            return {
                message: `Failed to update classroom member role: ${error.message}`
            }
        }
        else if(data == null || data.length == 0) {
            return {
                message : `Member not found`

            }
        }
        return {
            data : data,
            message : `Member role updated successfully`

        } 
    }

}

module.exports = new classroomMemberService();