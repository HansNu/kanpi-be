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

}

