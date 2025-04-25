const supabase = require('./supabaseClient');
const userService = require('./userService');
const classroomService = require('./classroomService');
const classroomSubjectService = require('./classroomSubjectService');
const aaiService = require('./aaiService');
const classroomMemberService = require('./classroomMemberService');
const _ = require('lodash');

class classroomMemberGrades {

    async getMemberGradeByAaiIdAndMemberId(req) {
        const existingAai = await aaiService.getAaiBySubjectAaiId(req);
        const aai = convertToCamelCase(existingAai[0]);

        const existingClass = await classroomService.getClassroomByClassroomCode(aai);
        const existingSubject = await classroomSubjectService.getListClassroomSubjectByClassroomCode(aai);
        const findSubject = existingSubject.filter(subject => subject.subject_code === aai.subjectCode);
        if (findSubject == null) {
            return `Subject Code ${req.subjectCode} Not Found In Classroom`;
        }

        const { data, error } = await supabase.from('classroom_member_grades').select('*')
            .eq('subject_code', aai.subjectCode)
            .eq('subject_aai_id', req.subjectAaiId)
            .eq('member_id', req.memberId);

        if (error) {
            return error;
        } else {
            return data;
        }
    }

    async getGeneralStudentGrades(req){
        const {data, error} = await supabase.from('classroom_member_grades').select('*').eq('classroom_code', req.classroomCode);
        if(data.length == 0 || data == null) {
            return {Message : `Student Grades Not Found`};
        }

        const compileAai = [];

        for (let x = 0; x < data.length; x++) {
            const stuGrade = convertToCamelCase(data[x]);
            const aai = await aaiService.getAaiBySubjectAaiId(stuGrade);
            
            if (aai) compileAai.push(aai[0]);
        }

        const aaiMap = {};
        for (const aai of compileAai) {
            aaiMap[aai.subject_aai_id] = {
                subjectAaiId : aai.subject_aai_id,
                aaiName: aai.aai_name,
                aaiDescr: aai.aai_descr,
                aaiWeight: aai.aai_weight,
                subjectCode: aai.subject_code
            };
        }
        

        const studentGrades = [];

        for (const entry of data) {
            const { member_id, score, subject_aai_id, grade} = entry;
        
            let student = studentGrades.find(s => s.memberId === member_id);
        
            if (!student) {
                student = {
                    memberId: member_id,
                    scores: [],
                    total: 0,
                    count: 0
                };
                studentGrades.push(student);
            }
        
            student.scores.push({
                subjectAaiid: subject_aai_id,
                subjectCode: aaiMap[subject_aai_id].subjectCode,
                aaiName: aaiMap[subject_aai_id].aaiName,
                aaiDescr: aaiMap[subject_aai_id].aaiDescr,
                aaiWeight: aaiMap[subject_aai_id].aaiWeight,
                grade: grade,
                score: parseFloat(score)
            });
        
            student.total += parseFloat(score);
            student.count += 1;
        }
        
        const studentList = [];

        for (let i = 0; i < studentGrades.length; i++) {
            const memberId = studentGrades[i].memberId;
            const studentData = await classroomMemberService.getClassroomMemberByMemberId(memberId);
            studentList.push(studentData[0]);
        }


        const result = [];

        for(const j in studentGrades) {
            const gradeData = studentGrades[j];
            const studentInfo = studentList.find(s => s.member_id === gradeData.memberId);

            result.push({
                memberId: gradeData.memberId,
                studentName: studentInfo.member_name,
                averageScore: gradeData.total / gradeData.count,
                scores : gradeData.scores
            })
        }
        
        return result;
    }

    async getSubjectStudentGrades(req){
        const {data, error} = await supabase.from('classroom_member_grades').select('*').eq('classroom_code', req.classroomCode).eq('subject_code', req.subjectCode);
        if(data.length == 0 || data == null) {
            return {Message : `Student Grades Not Found`};
        }

        const compileAai = [];

        for (let x = 0; x < data.length; x++) {
            const stuGrade = convertToCamelCase(data[x]);
            const aai = await aaiService.getAaiBySubjectAaiId(stuGrade);
            
            if(aai[x].aai_type == 'Subject') {
                if (aai) compileAai.push(aai[0]);
            }
        }

        const aaiMap = {};
        for (const aai of compileAai) {
            aaiMap[aai.subject_aai_id] = {
                subjectAaiid: aai.subject_aai_id,
                aaiName: aai.aai_name,
                aaiDescr: aai.aai_descr,
                aaiWeight: aai.aai_weight,
                subjectCode: aai.subject_code
            };
        }
        

        const studentGrades = [];

        if(!Object.keys(aaiMap).length)
        {
            return {
                Message : `No Grades Found On Any Subject`
            }
        }
        for (const entry of data) {
            const { member_id, score, subject_aai_id, grade } = entry;
        
            let student = studentGrades.find(s => s.memberId === member_id);
        
            if (!student) {
                student = {
                    memberId: member_id,
                    scores: [],
                    total: 0,
                    count: 0
                };
                studentGrades.push(student);
            }
        
            student.scores.push({
                subjectAaiid: subject_aai_id,
                subjectCode: aaiMap[subject_aai_id].subjectCode,
                aaiName: aaiMap[subject_aai_id].aaiName,
                aaiDescr: aaiMap[subject_aai_id].aaiDescr,
                aaiWeight: aaiMap[subject_aai_id].aaiWeight,
                grade: grade,
                score: parseFloat(score)
            });
        
            student.total += parseFloat(score);
            student.count += 1;
        }
        
        const studentList = [];

        for (let i = 0; i < studentGrades.length; i++) {
            const memberId = studentGrades[i].memberId;
            const studentData = await classroomMemberService.getClassroomMemberByMemberId(memberId);
            studentList.push(studentData[0]);
        }


        const result = [];

        for(const j in studentGrades) {
            const gradeData = studentGrades[j];
            const studentInfo = studentList.find(s => s.member_id === gradeData.memberId);

            result.push({
                memberId: gradeData.memberId,
                studentName: studentInfo.member_name,
                averageScore: gradeData.total / gradeData.count,
                scores : gradeData.scores
            })
        }
        
        return result;
    }

    async addStudentGradeScore(req) {
        const existingAai = await aaiService.getAaiBySubjectAaiId(req);
        const aai = convertToCamelCase(existingAai[0]);
        const gradeRules = await aaiService.getAaiGradesByClassroomCode(aai);

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
            return { message: `No matching grade found` };
        }

        const { data, error } = await supabase.from('classroom_member_grades').insert([{
            member_id: req.memberId,
            subject_aai_id: req.subjectAaiId,
            score: req.score,
            grade: matchGrade,
            subject_code: existingAai[0].subject_code
        }]).select('*');

        if (error) return error;
        return data;
    }

}

function convertToCamelCase(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = _.camelCase(key); // Convert snake_case to camelCase
        acc[camelKey] = obj[key];
        return acc;
    }, {});
}

module.exports = new classroomMemberGrades();

