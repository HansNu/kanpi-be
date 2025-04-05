const supabase = require('./supabaseClient');
const userService = require('../services/userService');
const classroomService = require('../services/classroomService');
const { map } = require('lodash');

class aaiService{

    async addAai (req){
        const userData = await userService.getUserByUserId(req.userId);

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
        return data;
    }

    async getGeneralAaiByClassroomCode(req) {
        const { data, error } = await supabase
            .from('subject_academic_achievement_index')
            .select('*')
            .eq('classroom_code', req.classroomCode);


        if(error){
            return error;
        } else {
            return data;
        }
    }

    //getaaibyaaicode
    async getAaiByClassroomCode(req){
        const existingClass = await classroomService.getClassroomByClassroomCode(req);
        const {data, error} = await supabase.from('subject_academic_achievement_index').select('*').eq('classroom_code', req.classroomCode);

        if(error){
            return error;
        } else {
            return data;
        }
    }

    async getAaiGradesByClassroomCode(req){
        const existingClass = await classroomService.getClassroomByClassroomCode(req);
        const {data, error} = await supabase.from('subject_aai_grades').select('*').eq('classroom_code', req.classroomCode);

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
    
    

}

module.exports = new aaiService();
