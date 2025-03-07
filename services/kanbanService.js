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
            .eq('member_id', kanbanData.memberId).single();

        const classMemberRes = convertToCamelCase(getClassMemberData.data);

        const getClassroom = await classroomService.getClassroomByClassroomCode(classMemberRes);

        const getClassroomSubject = await classroomSubjectService.getListClassroomSubjectByClassroomCode(classMemberRes);
        const findSubject = getClassroomSubject.find(subject => subject.subject_code === kanbanData.subjectCode);

        if (findSubject == null || findSubject.length == 0) {
            return 'Subject not found in classroom';
        }

        const { data, error } = await supabase.from('kanban').insert([
            {
                kanban_name: kanbanData.kanbanName,
                kanban_descr: kanbanData.kanbanDescr,
                member_id: classMemberRes.memberId,
                subject_code: kanbanData.subjectCode,
                deadline: kanbanData.deadline,
                created_by: kanbanData.createdBy,
                updated_by: kanbanData.createdBy,
                user_id: classMemberRes.userId
            }
        ]).select('*');

        if (error) {
            throw new Error(`Error creating kanban: ${error.message}`);
        }

        return data[0];
    }

    //update kanban to in progress
    async updateKanbanToInProgress(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if (kanbanData == null || kanbanData.length == 0) {
            throw new Error('Kanban not found');
        }

        if (kanbanData.kanban_stat != 'NEW') {
            throw new Error('Kanban Status has to be in NEW to be updated to IN PROGRESS');
        }

        const { data, error } = await supabase.from('kanban').update({ kanban_stat: 'IN PROGRESS' }).eq('kanban_id', kanbanId).select('*');


        return data;
    }

    //update kanban to done
    async updateKanbanToDone(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if (kanbanData == null || kanbanData.length == 0) {
            throw new Error('Kanban not found');
        }

        if (kanbanData.kanban_stat != 'IN PROGRESS') {
            throw new Error('Kanban Status has to be in IN PROGRESS to be updated to DONE');
        }

        const { data, error } = await supabase.from('kanban').update({ kanban_stat: 'DONE' }).eq('kanban_id', kanbanId).select('*');

        return data;
    }

    //delete kanban
    async deleteKanban(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if (kanbanData == null || kanbanData.length == 0) {
            throw new Error('Kanban not found');
        }

        const { data, error } = await supabase.from('kanban').delete().eq('kanban_id', kanbanId).select('*');
        return data;
    }

    //get list kanban by user
    async getListKanbanByUser(userId) {
        const { data, error } = await supabase.from('kanban').select('*').eq('user_id', userId);

        if (data == null || data.length == 0) {
            return `Kanban not found`
        }

        return data;
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

        if(error){
            return error
        } else if (data == null || data.length == 0){
            return `Kanban not found or doesn't exist`
        } else{
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