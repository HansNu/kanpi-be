const supabase = require('./supabaseClient');
const userService = require('./userService');
const classroomService = require('./classroomService');
const classroomSubjectService = require('./classroomSubjectService');
const aaiService = require('./aaiService')

class classroomMemberGrades {

    async getMemberGradeBySubjectCodeAndAaiIdAndMemberId(req){
            const existingClass = await classroomService.getClassroomByClassroomCode(req);
            const existingSubject = await classroomSubjectService.getListClassroomSubjectByClassroomCode(req);
            const findSubject = existingSubject.find(subject => subject.subject_code === req.subjectCode);
            if (findSubject == null){
                return `Subject Code ${req.subjectCode} Not Found In Classroom`;
            }
    
            const existingAai = await aaiService.getAaiBySubjectAaiId(req);
    
            const {data, error} = await supabase.from('classroom_member_grades').select('*')
                                .eq('subject_code', req.subjectCode)
                                .eq('subject_aai_id', req.subjectAaiId)
                                .eq('member_id', req.memberId);
            
            if(error){
                return error;
            } else {
                return data;
            }
    }

    async addStudentGradeScore(req){
        const existingAai = await aaiService.getAaiBySubjectAaiId(req);
        const gradeRules = await aaiService.getAaiGradesByClassroomCode(req);

        let matchGrade = null;

        for (let i = 0; i < gradeRules.length; i++) {
            const rule = gradeRules[i];
            const min = parseFloat(rule.min_score);
            const max = rule.max_score !== null ? parseFloat(rule.max_score) : Infinity;
    
            if (req.score >= min && req.score <= max) {
                matchGrade = rule.grade;
                break;
            }
        }
    
        if (!matchGrade) {
            return { message: `No matching grade found for score ${req.score}` };
        }
    
        const {data, error} = await supabase.from('classroom_member_grades').insert([{
            member_id : req.memberId,
            subject_aai_id : req.subjectAaiId,
            score : req.score,
            grade : matchGrade,
            subject_code : req.subjectCode,
            aaiType : req.aaiType
        }]).select('*');

        if (error) return error;
        return data;
    }

}

module.exports = new classroomMemberGrades();

