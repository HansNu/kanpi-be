const supabase = require('./supabaseClient');

class subjectService {

    async getSubjectBySubjectCode(subjectCode) {
        const { data, error } = await supabase.from('subject').select('*').eq('subject_code', subjectCode);
        return data[0];
    }
}

module.exports = new subjectService();