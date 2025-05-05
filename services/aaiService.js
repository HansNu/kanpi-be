const supabase = require('./supabaseClient');
const userService = require('../services/userService');
const classroomService = require('../services/classroomService');
const classroomSubjectService = require('../services/classroomSubjectService');
const _ = require('lodash');
const classroomMemberService = require('./classroomMemberService');


class aaiService{

    async addAai (req){
        const userData = await userService.getUserByUserId(req.userId);

        let isMaxWeight = 0;
        let totalClassAaiWeight = 0;
        let aaiWeight = 0;

        if(req.aaiType == 'General'){
            let generalAaiList = await this.getGeneralAaiByClassroomCode(req);

            for(let i = 0; i < generalAaiList.length; i++) {
                if(generalAaiList[i].subject_code === req.subjectCode) {
                    return {
                        message: `Duplicate General AAI for Subject Code ${req.subjectCode}`
                    };
                }
            }
            
            isMaxWeight = generalAaiList;
            
            for(let i = 0; i<isMaxWeight.length; i++){
                aaiWeight = isMaxWeight[i].aai_weight || 0;
                totalClassAaiWeight += aaiWeight;
            }
        } else if(req.aaiType == 'Subject'){
            isMaxWeight = await this.getSubjectAaiByClassroomCode(req);

            let subjectAai = isMaxWeight.filter(subject => subject.subject_code === req.subjectCode);
            
            for(let j = 0; j< subjectAai.length; j++){
                aaiWeight = subjectAai[j].aai_weight || 0;
                totalClassAaiWeight += aaiWeight;
            }
        }

        if(totalClassAaiWeight > 1.0) {
            return {
                Message : `Total Weight Of AAI Must Not Exceed 1, Current AAI Total Weight : ${totalClassAaiWeight}`
            }        
        }

        const newTotalAaiWeight = totalClassAaiWeight + req.aaiWeight 
        if (newTotalAaiWeight > 1.0 ){
            return {
                Message : `The New AAI Weight Exceeds The Maximum AAI Weight of 1`,
                NewTotalWeight : newTotalAaiWeight
            }
        }

        const {data, error} = await supabase.from('subject_academic_achievement_index')
                                .insert([
                                    {
                                        subject_code : req.subjectCode,
                                        aai_name : req.aaiName,
                                        aai_descr : req.aaiDescr,
                                        aai_weight : req.aaiWeight,
                                        aai_active : true,
                                        created_by : userData.name,
                                        updated_by : userData.name,
                                        aai_type : req.aaiType,
                                        classroom_code : req.classroomCode
                                    }
                                ]).select('*');
        
        if (data == null || data.length == 0){
            return {message : `Failed to add aai : ${error}`}
        }
        return {
            AAI :data,
            Message : `Academic Achievement Index(AAI) Added Successfully` 
        };
    }

    async editAai (req){
        const userData = await userService.getUserByUserId(req.userId);

        let isMaxWeight = 0;
        let totalClassAaiWeight = 0;
        let aaiWeight = 0;

        if (req.aaiType === 'General') {
            isMaxWeight = await this.getGeneralAaiByClassroomCode(req);
        } else if (req.aaiType === 'Subject') {
            isMaxWeight = await this.getSubjectAaiByClassroomCode(req);
        }
        
        if (!isMaxWeight || isMaxWeight.length === 0) {
            return { Message: `AAI Of Class ${req.classroomCode} Not Found` };
        }
        
        if (req.aaiType === 'General') {
            for (let i = 0; i < isMaxWeight.length; i++) {
                aaiWeight = isMaxWeight[i].aai_weight || 0;
                totalClassAaiWeight += aaiWeight;
            }
        } else if (req.aaiType === 'Subject') {
            const subjectAai = isMaxWeight.filter(subject => subject.subject_code === req.subjectCode);
        
            for (let j = 0; j < subjectAai.length; j++) {
                aaiWeight = subjectAai[j].aai_weight || 0;
                totalClassAaiWeight += aaiWeight;
            }
        }        

        const checkSameAai = isMaxWeight.filter(x => x.subject_aai_id == req.subjectAaiId);
        const newTotalWeight = (totalClassAaiWeight - checkSameAai[0].aai_weight) + req.aaiWeight;
        if (newTotalWeight > 1.0) {
            return {
                Message: `Updated AAI Weight = ${newTotalWeight}, Total Updated Weight Cannot Exceed 1`,
            };
        }    

        const {data, error} = await supabase.from('subject_academic_achievement_index')
                                .update([
                                    {
                                        aai_name : req.aaiName,
                                        aai_descr : req.aaiDescr,
                                        aai_weight : req.aaiWeight,
                                        aai_active : true,
                                        created_by : userData.name,
                                        updated_by : userData.name
                                    }
                                ])
                                .eq('subject_aai_id', req.subjectAaiId)
                                .select('*');
        
        if (data == null || data.length == 0){
            return {Message : `Failed to add aai : ${error}`}
        }
        return {
            AAI :data,
            Message : `Academic Achievement Index(AAI) Edited Successfully` 
        };
    }

    async getGeneralAaiByClassroomCode(req) {
        const { data, error } = await supabase
            .from('subject_academic_achievement_index')
            .select('*')
            .eq('classroom_code', req.classroomCode).eq('aai_type', 'General');


        if(error){
            return error;
        } else {
            return data;
        }
    }

    async getSubjectAaiByClassroomCode(code) {
        const { data, error } = await supabase
            .from('subject_academic_achievement_index')
            .select('*')
            .eq('classroom_code', code.classroomCode).eq('aai_type', 'Subject');


        if(error){
            return error;
        } else {
            return data;
        }
    }

    async getSubjectAaiBySubjectCodeAndClassroomCode(req){
        const { data, error } = await supabase
            .from('subject_academic_achievement_index')
            .select('*')
            .eq('classroom_code', req.classroomCode).eq('subject_code', req.subjectCode).eq('aai_type', 'Subject');


        if(error){
            return error;
        } else {
            return data;
        }
    }

    async getListGeneralAaiClassroomByUserId(req) {
        const userClassroomList = await classroomService.getListClassroomByUserId(req.userId);
        const getMemberId = await classroomMemberService.getClassroomMemberByUserId(req.userId);
        
        let classroom = [];
        
        for (const userClass of userClassroomList) {
            const classList = await convertToCamelCase(userClass);
            const classroomMemberGradesService = require('../services/classroomMemberGradesService');
            const getGeneralGrades = await classroomMemberGradesService.getGeneralStudentGrades(classList);
            const getAai = await this.getSubjectAaiByClassroomCode(classList);
            
            let gradedAaiCount = 0;
            let notGradedCount = 0;
            
            for (const aaiItem of getAai) {
                const aaiGrades = await supabase
                    .from('classroom_member_grades')
                    .select('*')
                    .eq('subject_aai_id', aaiItem.subject_aai_id);
                    
                if (aaiGrades && aaiGrades.data && aaiGrades.data.length > 0) {
                    gradedAaiCount++;
                } else {
                    notGradedCount++;
                }
            }
            
            let avgScore = 0;
            if (!getGeneralGrades.Message) {
                avgScore = getGeneralGrades[0].averageScore;
            }
            
            classroom.push({
                classroom: `${userClass.classroom_code} - ${userClass.classroom_name}`,
                data : {
                    classroomName: classList.classroomName,
                    score: avgScore,
                    gradedAaiCount: gradedAaiCount,
                    notGradedCount: notGradedCount,
                    totalAai: getAai.length
                }
            })
        }
        
        return classroom;
    }

    async deleteAai(req){
        const existingAai = await this.getAaiByClassroomCode(req);
        if (existingAai == null || existingAai.length == 0){
            return {
                Message : `AAI Of Class ${req.classroomCode} Not Found`
            }
        }
        const deleteGrades = await supabase.from('classroom_member_grades').delete().eq('subject_aai_id', req.subjectAaiId).eq('classroom_code', req.classroomCode).select('*');
        const {data, error} = await supabase.from('subject_academic_achievement_index').delete().eq('subject_aai_id', req.subjectAaiId).eq('classroom_code', req.classroomCode).select('*');
        
        if(error){
            return {
                message: error
            };
        }
        return {
            Message : 'AAI Deleted Successfully',
            AAI : data
        }
    }

    async getAaiByClassroomCode(req){
        const existingClass = await classroomService.getClassroomByClassroomCode(req);
        const {data, error} = await supabase.from('subject_academic_achievement_index').select('*').eq('classroom_code', req.classroomCode);

        if(error){
            return error;
        } else {
            return data;
        }
    }

    async getAaiBySubjectAaiId(req){
        const{data, error} = await supabase.from('subject_academic_achievement_index').select('*').eq('subject_aai_id', req.subjectAaiId);
        if(data == null || data.length == 0){
            return {
                Message: `AAI Not Found`
            };
        }

        if(error){
            return error;
        } else {
            return data;
        }
    }

    async getAaiGradesByClassroomCode(req){
        const existingClass = await classroomService.getClassroomByClassroomCode(req);
        const {data, error} = await supabase.from('subject_aai_grades').select('*').eq('classroom_code', req.classroomCode);
        if(data.length == 0 || data == null){
            return `Grade System Not Found`;
        }
    
        if(error){
            return error;
        } else {
            return data;
        }
    }

    async addAaiGrade(req) {
        if (!req || !Array.isArray(req) || req.length === 0) {
            return { message: "Invalid input format, expected a non-empty grades array" };
        }
    
        const userData = await userService.getUserByUserId(req[0].userId);
        if (!userData) {
            return { message: "User not found" };
        }
    
        const insertData = req.map(item => ({
            classroom_code: item.classroomCode,
            grade: item.grade,
            min_score: item.minScore,
            max_score: item.maxScore || null,
            descr: item.descr,
            created_by: userData.name,
            updated_by: userData.name,
            operator: item.operator,
        }));
    
        const { data, error } = await supabase
            .from("subject_aai_grades")
            .insert(insertData)
            .select("*");
    
        if (error) {
            return { message: `Failed to add AAI grade: ${error.message}` };
        }
    
        return {
            Message : `Grades added successfully`,
            Grades : data
        };
    }

    async editAaiGrade(req) {
        if (!req || !Array.isArray(req) || req.length === 0) {
            return { message: "Invalid input format, expected a non-empty grades array" };
        }

        const existingAaiGrade = await this.getAaiGradesByClassroomCode(req[0]);
        if(existingAaiGrade.length == 0 || existingAaiGrade == null){
            return `Grades in Classroom ${req[0].classroomCode} doesn't exist`
        }
    
        const userData = await userService.getUserByUserId(req[0].userId);
        if (!userData) {
            return { message: "User not found" };
        }
    
        for (let i = 0; i < req.length; i++) {
            const item = req[i];
        
            const updateData = {
                classroom_code: item.classroomCode,
                grade: item.grade,
                min_score: item.minScore,
                max_score: item.maxScore || null,
                descr: item.descr,
                created_by: userData.name,
                updated_by: userData.name,
                operator: item.operator
            };
        
            const { data, error } = await supabase
                .from("subject_aai_grades")
                .update(updateData)
                .eq("subject_aai_grades_id", item.subjectAaiGradesId)
                .select('*');
        
                if (error) {
                    return { message: `Failed to update AAI grade: ${error.message}` };
                }
            
                return {
                    Message : `Grades updated successfully`,
                    Grades : data
                };
        }
        
    }

    async deleteAaiGrade(req) {
        const existingGrades = await this.getAaiGradesByClassroomCode(req);
    
        if (!existingGrades || existingGrades.length === 0) {
            return `No Grading Found With Classroom Code ${req.classroomCode}`;
        }
    
        const { data, error } = await supabase
            .from('subject_aai_grades')
            .delete()
            .eq('classroom_code', req.classroomCode)
            .eq('subject_aai_grades_id', req.subjectAaiGradesId);
    
        if (error) {
            return error;
        }
    
        return {
            message: 'Grades Deleted Successfully',
        };
    }
        

}

function convertToCamelCase(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = _.camelCase(key); // Convert snake_case to camelCase
        acc[camelKey] = obj[key];
        return acc;
    }, {});
}

module.exports = new aaiService();
