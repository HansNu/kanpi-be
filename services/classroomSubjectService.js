const supabase = require('./supabaseClient');
const classroomService = require('./classroomService');

class classroomSubjectService {

    async getListClassroomSubjectByClassroomCode(reqCode) {
        const {data, error} = await supabase.from('classroom_subjects').select('*').eq('classroom_code', reqCode.classroomCode);

        if (data == null || data.length == 0) {
            return {
                message : `No Subject found in classroom with code ${reqCode.classroomCode}`
            }
        }
        
        return data;
    }

    async addClassroomSubjectBySubjectCodeAndSubjectName(req) {

        const classrooms = await classroomService.getClassroomByClassroomCode(req);

        if (classrooms == null || classrooms.length == 0) {
            return {
                message : `Classroom with code ${req.classroomCode} not found`
            }
        }

        const existingSubject  = await supabase.from('classroom_subjects').select('*')
                                .eq('subject_code', req.subjectCode).eq('classroom_code', req.classroomCode)
                                .eq('subject_name', req.subjectName);

        if (existingSubject.data.length != 0) {
            return {
                message : `Subject already exists in classroom ${req.classroomCode}`
            }
        }

        const { data, error } = await supabase.from('classroom_subjects').insert([
            {
                classroom_code: req.classroomCode,
                subject_name : req.subjectName,
                subject_code: req.subjectCode,
                subject_active : true,
                descr : req.descr
            }
        ]).select('*');
        return data;
    }

    async deleteClassroomSubjectBySubjectCodeAndClassroomCode(req){
        const classrooms = await classroomService.getClassroomByClassroomCode(req);

        if (classrooms == null || classrooms.length == 0) {
            return {
                message : `Classroom with code ${req.classroomCode} not found`
            }
        }

        const existingSubject  = await supabase.from('classroom_subjects').select('*')
                                .eq('subject_code', req.subjectCode).eq('classroom_code', req.classroomCode);

        if (existingSubject.data.length == 0 || existingSubject == null) {
            return {
                message : `Subject doesn't exists in classroom ${req.classroomCode}`
            }
        }
        
        const {data, error} = await supabase.from('classroom_subjects').delete().eq('subject_code', req.subjectCode).select('*');

        if(data.length == 0 || data == null || error){
            return `failed to delete subject`
        } else if (error) {
            return error
        } else {
            return {message : `Subject ${existingSubject.data[0].subject_name} Has Been Removed From Classroom ${existingSubject.data[0].classroom_code}`};
        }
    }


}

module.exports = new classroomSubjectService();