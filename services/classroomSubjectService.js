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

    async addClassroomSubjectBySubjectCode(req) {

        const classrooms = await classroomService.getClassroomByClassroomCode(req);

        if (classrooms == null || classrooms.length == 0) {
            return {
                message : `Classroom with code ${req.classroomCode} not found`
            }
        }

        const existingSubject  = await supabase.from('classroom_subjects').select('*').eq('subject_code', req.subjectCode).eq('classroom_code', req.classroomCode);

        if (existingSubject.data.length != 0) {
            return {
                message : `Subject with code ${req.subjectCode} already exists in classroom with code ${req.classroomCode}`
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
}

module.exports = new classroomSubjectService();