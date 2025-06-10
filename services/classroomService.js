const supabase = require('./supabaseClient');
const model = require('../models/index');

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

        if(classCode == null || classCode.length == 0){
            return {
                message : `Classroom with code ${reqCode.classroomCode} not found`
            };
        }

        return classCode.data;
    }

    async addClassroom(classroomData) {
        const existingClassroom = await this.getClassroomByClassroomCode(classroomData.classroomCode);
        if (existingClassroom.length > 0) {
            throw new Error('Classroom code already exists');
        }
        
        const user= require('../services/userService');
        const adminData = await user.getUserByUserId(classroomData.userId);
        
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
                    member_name: adminData.name,
                    member_active: true,
                }
            ])
            .select('*'); 

        if (adminError) {
            throw new Error(`Error adding admin: ${adminError.message}`);
        }
    
        return { newClassroom, addSuperAdmin };
    }
    

    async deleteClassroom(classroomCode) {
        const {data:grades, error:gradesErr} = await supabase.from('classroom_member_grades').delete().eq('classroom_code', classroomCode);
        if(gradesErr) return{message: gradesErr};

        const {data:aaiGrades, error:aaiGradesErr} = await supabase.from('subject_aai_grades').delete().eq('classroom_code', classroomCode);
        if (aaiGradesErr) return{message: aaiGradesErr};

        const {data:kanban, error:kanbanErr} = await supabase.from('kanban').delete().eq('classroom_code', classroomCode);
        if (kanbanErr) return{message: kanbanErr};

        const { data:memberData, error: memberError } = await supabase
            .from("classroom_member")
            .delete()
            .eq("classroom_code", classroomCode).select('*');
    
        if (memberError) return(`Failed to delete classroom members: ${memberError.message}`);
    
        const { data:adminData, error: adminError } = await supabase
            .from("classroom_admin")
            .delete()
            .eq("classroom_code", classroomCode).select('*');
    
        if (adminError) return(`Failed to delete classroom admins: ${adminError.message}`);
    
        const { data: subjectData, error: subjectError } = await supabase
            .from("classroom_subjects")
            .delete()
            .eq("classroom_code", classroomCode).select('*');
    
        if (subjectError) return(`Failed to delete classroom subjects: ${subjectError.message}`);
    
        const { data: classroomData, error: classroomError } = await supabase
            .from("classroom")
            .delete()
            .eq("classroom_code", classroomCode).select('*');
    
        if (classroomError) return(`Failed to delete classroom: ${classroomError.message}`);

        if((memberData == null || memberData.length == 0) && (adminData == null || adminData.length == 0) && 
            (subjectData == null || subjectData.length == 0) && (classroomData == null || classroomData.length == 0)){
                return {
                    message : `Classroom doesn't exist or has been deleted`
                }
            }
    
        return { message: "Classroom and related data deleted successfully" };
    }

    async updateClassroomName(req){
        const classroomExist = await this.getClassroomByClassroomCode(req);
        if (classroomExist.length == 0 || classroomExist == null){
            return `Classroom not found`;
        }

        const {data, error} = await supabase.from('classroom')
                                .update({classroom_name: req.classroomName})
                                .eq('classroom_code', req.classroomCode)
                                .select('*');
        if(error){
            return error
        } else {
            return data;
        }
    }
    
}

module.exports = new classroomService();