const supabase = require('./supabaseClient');
const classroomMemberService = require('./classroomMemberService');
const classroomService = require('./classroomService');
const classroomSubjectService = require('./classroomSubjectService');
const model = require('../models/index');
const _ = require('lodash');

class kanbanService {

    async getKanbanById(kanbanId) {
        const { data, error } = await supabase.from('kanban').select('*').eq('kanban_id', kanbanId);

        return data[0];
    }

    async addKanban(kanbanData) {
        const getClassMemberData = await supabase.from('classroom_member').select('*')
            .eq('user_id', kanbanData.userId).single();

        if (getClassMemberData == null || getClassMemberData.data == null) {
            return `Member Not Found`
        }

        const classMemberRes = convertToCamelCase(getClassMemberData.data);

        const getClassroom = await classroomService.getClassroomByClassroomCode(classMemberRes);

        const getClassroomSubject = await classroomSubjectService.getListClassroomSubjectByClassroomCode(classMemberRes);
        const findSubject = getClassroomSubject.find(subject => subject.subject_code === kanbanData.subjectCode);
        const subject = convertToCamelCase(findSubject);

        if (findSubject == null || findSubject.length == 0) {
            return 'Subject not found in classroom';
        }

        const { data, error } = await supabase.from('kanban').insert([
            {
                kanban_name: kanbanData.kanbanName,
                kanban_descr: kanbanData.kanbanDescr,
                member_id: classMemberRes.memberId,
                user_id: kanbanData.userId,
                subject_code: kanbanData.subjectCode,
                deadline: kanbanData.deadline,
                created_by: kanbanData.createdBy,
                updated_by: kanbanData.createdBy,
                user_id: classMemberRes.userId,
                classroom_code: findSubject.classroom_code
            }
        ]).select('*');

        if (error) {
            return new Error(`Error creating kanban: ${error.message}`);
        }

        return {
            Kanban: data[0],
            Message: `Kanban Added Successfully`
        };
    }

    async editKanban(reqKanban) {
        // Attempt to update the Kanban directly
        const { data, error } = await supabase
            .from('kanban')
            .update({
                kanban_name: reqKanban.kanbanName,
                kanban_descr: reqKanban.kanbanDescr,
                subject_code: reqKanban.subjectCode,
                deadline: reqKanban.deadline
            })
            .eq('kanban_id', reqKanban.kanbanId)
            .select('*'); // Ensures updated data is returned
    
        // Handle possible errors
        if (error) {
            throw new Error(`Failed to update Kanban: ${error.message}`);
        }
    
        if (!data || data.length === 0) {
            throw new Error('Kanban not found');
        }
    
        return {
            kanban: data[0],
            message: 'Kanban updated successfully'
        };
    }
    

    //update kanban to in progress
    async updateKanbanToInProgress(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if (kanbanData == null || kanbanData.length == 0) {
            return new Error('Kanban not found');
        }

        if (kanbanData.kanban_stat != 'Pending') {
            return new Error('Kanban Status has to be in Pending to be updated to In Progress');
        }

        const { data, error } = await supabase.from('kanban').update({ kanban_stat: 'In Progress' }).eq('kanban_id', kanbanId).select('*');


        return {
            Kanban: data,
            message: 'Kanban updated to In Progress'
        };
    }

    //update kanban to done
    async updateKanbanToDone(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if (kanbanData == null || kanbanData.length == 0) {
            return new Error('Kanban not found');
        }

        if (kanbanData.kanban_stat != 'In Progress') {
            return new Error('Kanban Status has to be in IN PROGRESS to be updated to DONE');
        }

        const { data, error } = await supabase.from('kanban').update({ kanban_stat: 'Done' }).eq('kanban_id', kanbanId).select('*');

        return {
            Kanban: data,
            message: 'Kanban updated to Done'
        };
    }

    //delete kanban
    async deleteKanban(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if (kanbanData == null || kanbanData.length == 0) {
            return new Error('Kanban not found');
        }

        const { data, error } = await supabase.from('kanban').delete().eq('kanban_id', kanbanId).select('*');
        return data;
    }

    //get list kanban by user
    async getListKanbanByUser(userId) {
        const { data, error } = await supabase
            .from('kanban')
            .select('*')
            .eq('user_id', userId);

        if (!data || data.length === 0) {
            return 'Kanban not found';
        }

        // Extract all subject_code values
        const subjectCodes = data.map(item => item.subject_code);

        // Fetch subject names for all subject_codes
        const { data: subjects, error: subjectError } = await supabase
            .from('classroom_subjects')
            .select('subject_name, subject_code')
            .in('subject_code', subjectCodes);

        if (subjectError) {
            return 'Failed to fetch subjects';
        }

        // Map subjects to Kanban items
        const kanbanWithSubjects = data.map(kanban => ({
            ...kanban,
            subject: subjects.find(subject => subject.subject_code === kanban.subject_code) || null
        }));

        return kanbanWithSubjects;
    }


    async getListKanbanByUserAndMonth(req) {
        const { data, error } = await supabase.rpc('get_kanban_by_user_and_month', {
            p_user_id: req.userId,
            p_year: req.year,
            p_month: req.month
        });

        if (error) {
            console.error("Error fetching Kanban:", error);
            return error;
        }

        return data;
    }

    async getListKanbanByUserAndClassroom(req) {
        const { data, error } = await supabase.from('kanban').select('*')
            .eq('user_id', req.userId).eq('classroom_code', req.classroomCode);

        if (error) {
            return error
        } else if (data == null || data.length == 0) {
            return `Kanban not found or doesn't exist`
        } else {
            return data
        }
    }

}



function convertToCamelCase(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = _.camelCase(key); // Convert snake_case to camelCase
        acc[camelKey] = obj[key];
        return acc;
    }, {});
}


module.exports = new kanbanService();