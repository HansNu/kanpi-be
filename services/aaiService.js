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

}

module.exports = new aaiService();
