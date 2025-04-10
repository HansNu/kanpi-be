const supabase = require('./supabaseClient');
const userService = require('../services/userService');
const classroomService = require('../services/classroomService');
const { map } = require('lodash');

class aaiService{

    async addAai (req){
        const userData = await userService.getUserByUserId(req.userId);

        const isMaxWeight = await this.getAaiByClassroomCode(req);

        let totalClassAaiWeight = 0;
        
        for(let i = 0; i<isMaxWeight.length; i++){
            const aaiWeight = isMaxWeight[i].aai_weight || 0;
            totalClassAaiWeight += aaiWeight;
        }

        if(totalClassAaiWeight > 1) {
            return {
                Message : `Total Weight Of A Class Must Not Exceed 1, Current AAI Total Weight : ${totalClassAaiWeight}`
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

        const isMaxWeight = await this.getAaiByClassroomCode(req);
        if(isMaxWeight == null || isMaxWeight.length == 0){
            return {Message : `AAI Of Class ${req.classroomCode} Not Found`}
        }

        let totalClassAaiWeight = 0;
        
        for(let i = 0; i<isMaxWeight.length; i++){
            if(isMaxWeight[i].subject_aai_id == req.subjectAaiId) {
                continue;
            }
            const aaiWeight = isMaxWeight[i].aai_weight || 0;
            totalClassAaiWeight += aaiWeight;
        }

        const newTotalWeight = totalClassAaiWeight + req.aaiWeight;
        if (newTotalWeight > 1.0) {
            return {
                error: true,
                message: `Updated AAI Weight = ${newTotalWeight}, Total Updated Weight Cannot Exceed 1`,
            };
        }    

        const {data, error} = await supabase.from('subject_academic_achievement_index')
                                .update([
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
                                ])
                                .eq('subject_aai_id', req.subjectAaiId)
                                .select('*');
        
        if (data == null || data.length == 0){
            return {message : `Failed to add aai : ${error}`}
        }
        return {
            AAI :data,
            Message : `Academic Achievement Index(AAI) Added Successfully` 
        };
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

module.exports = new aaiService();
