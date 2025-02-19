const supabase = require('./supabaseClient');
const model = require('../models/index');
const userController = require('../controllers/userController');
const userService = require('../services/userService');

class classroomService {

    async getListClassroom() {
        const { data, error } = await supabase.from('classroom').select('*');
        return data;
    }

    async getListClassroomByUserId(userId) {
        if (!userId) {
            throw new Error("Invalid userId");
        }
    
        const { data: memberData, error: memberError } = await supabase
            .from('classroom_member')
            .select('classroom_code')
            .eq('user_id', userId);
    
        const { data: adminData, error: adminError } = await supabase
            .from('classroom_admin')
            .select('classroom_code')
            .eq('user_id', userId);
    
        if (memberError || adminError) {
            throw new Error(`Error fetching classrooms: ${memberError?.message || adminError?.message}`);
        }
    
        const classroomCodes = [
            ...(memberData || []).map(({ classroom_code }) => classroom_code),
            ...(adminData || []).map(({ classroom_code }) => classroom_code)
        ];
        
        const uniqueClassroomCodes = [...new Set(classroomCodes)];
    
        if (uniqueClassroomCodes.length === 0) {
            return []; 
        }
    
        const { data: classroomData, error: classroomError } = await supabase
            .from('classroom')
            .select('*')
            .in('classroom_code', uniqueClassroomCodes);
    
        if (classroomError) {
            throw new Error(`Error fetching classroom data: ${classroomError.message}`);
        }

        const adminClassroomSet = new Set((adminData || []).map(({ classroom_code }) => classroom_code));

        const updatedClassroomData = classroomData.map(classroom => ({
            ...classroom,
            classroom_member_amt: adminClassroomSet.has(classroom.classroom_code) 
                ? classroom.classroom_member_amt + 1 
                : classroom.classroom_member_amt
        }));


        return updatedClassroomData;
    }
    
    async generateClassroomCode() {
        const generateRandomCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();
    
        let classroomCode;
        let isUnique = false;
    
        while (!isUnique) {
            classroomCode = generateRandomCode();
    
            const { data, error } = await supabase
                .from('classroom')
                .select('classroom_code')
                .eq('classroom_code', classroomCode)
                .single();
    
            if (data == null) {
                isUnique = true;
                return classroomCode;
            }
        }
    
    }
    

    async getClassroomByClassroomCode(reqCode) {
        const classCode = await supabase.from('classroom').select('*').eq('classroom_code', reqCode.classroomCode);
        return classCode.data;
    }

    async addClassroom(classroomData) {
        const existingClassroom = await this.getClassroomByClassroomCode(classroomData.classroomCode);
        if (existingClassroom.length > 0) {
            throw new Error('Classroom code already exists');
        }
    
        const adminData = await userService.getUserByUserId(classroomData.userId);
        
        if (!adminData) {
            throw new Error('user not found');
        }
    
        const { data: newClassroom, error: classroomError } = await supabase
            .from('classroom')
            .insert({
                classroom_code: classroomData.classroomCode,
                classroom_name: classroomData.classroomName,
                classroom_member_amt: classroomData.classroomMemberAmt,
                classroom_stat: classroomData.classroomStat,
            }) 
            .select('*'); 
    
        if (classroomError) {
            throw new Error(`Error creating classroom: ${classroomError.message}`);
        }
    
        const { data: addSuperAdmin, error: adminError } = await supabase
            .from('classroom_admin')
            .insert([
                {
                    user_id: adminData.user_id,
                    classroom_code: classroomData.classroomCode,
                    admin_name: adminData.name,
                    admin_active: true,
                }
            ])
            .select('*'); 

        if (adminError) {
            throw new Error(`Error adding admin: ${adminError.message}`);
        }
    
        return { newClassroom, addSuperAdmin };
    }
    

    async deleteClassroom(classroomCode) {
        const { error: memberError } = await supabase
            .from("classroom_member")
            .delete()
            .eq("classroom_code", classroomCode);
    
        if (memberError) throw new Error(`Failed to delete classroom members: ${memberError.message}`);
    
        const { error: adminError } = await supabase
            .from("classroom_admin")
            .delete()
            .eq("classroom_code", classroomCode);
    
        if (adminError) throw new Error(`Failed to delete classroom admins: ${adminError.message}`);
    
        const { error: subjectError } = await supabase
            .from("classroom_subjects")
            .delete()
            .eq("classroom_code", classroomCode);
    
        if (subjectError) throw new Error(`Failed to delete classroom subjects: ${subjectError.message}`);
    
        const { error: classroomError } = await supabase
            .from("classroom")
            .delete()
            .eq("classroom_code", classroomCode);
    
        if (classroomError) throw new Error(`Failed to delete classroom: ${classroomError.message}`);
    
        return { message: "Classroom and related data deleted successfully" };
    }
    
    
}

module.exports = new classroomService();