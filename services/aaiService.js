const supabase = require('./supabaseClient');
const userService = require('../services/userService');

class aaiService{

    async addAai (req){
        const userData = await userService.getUserByUserId(req.userId);

        const {data, error} = await supabase.from('subject_academic_achievement_index')
                                .insert([
                                    {
                                        subject_code : req.subjectCode,
                                        aai_code : req.aaiCode,
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
    async getAaiByAaiCode(req){
        const {data, error} = await supabase.from('subject_academic_achievement_index').select('*').eq('aai_code', req.aaiCode);

        if(error){
            return error;
        } else {
            return data;
        }
    }


    async addAaiGrade(req) {
        if (!Array.isArray(req) || req.length === 0) {
            return { message: "Invalid input format, expected a non-empty array" };
        }
    
        const uniqueAaiCodes = [...new Set(req.map(item => item.aaiCode))];
    
        if (uniqueAaiCodes.length > 1) {
            return { message: "All aaiCode values must be the same" };
        }
        let getCode = req[0];
        const checkAai = await this.getAaiByAaiCode(getCode);
    
        if (!checkAai || checkAai.length === 0) {
            return { message: `Aai with code ${req.aaiCode} not found` };
        }
    
        if (!Array.isArray(req)) {
            return { message: "Invalid input format, expected an array" };
        }
    
        const insertData = req.map(item => ({
            subject_aai_id: item.subjectAaiId,
            aai_code: checkAai[0].aai_code, 
            grade: item.grade,
            min_score: item.minScore,
            max_score: item.maxScore,
            descr: item.descr,
            created_by: item.createdBy,
            updated_by: item.updatedBy,
            updated_date: item.updatedDate,
            operator : item.operator
        }));
    
        const { data, error } = await supabase
            .from("subject_aai_grades")
            .insert(insertData)
            .select("*");
    
        if (error) {
            return { message: `Failed to add aai grade: ${error.message}` };
        }
    
        return data;
    }
    

}

module.exports = new aaiService();
