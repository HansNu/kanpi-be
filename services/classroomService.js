const supabase = require('./supabaseClient');
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

    async getClassroomByClassroomCode(reqCode) {
        const classCode = await supabase.from('classroom').select('*').eq('classroom_code', reqCode.classroomCode);
        return classCode.data;
    }

    async addClassroom(classroomData) {
        const existingClassroom = await this.getClassroomByClassroomCode(classroomData.classroom_code);
        if(existingClassroom.length > 0) {
            throw new Error('Classroom code already exists');
        }

        const newClassroom = await supabase.from('classroom').insert(classroomData).select('*');

        return newClassroom;
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