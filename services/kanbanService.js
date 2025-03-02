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
                                .eq('member_id', kanbanData.classMemberId).single();
        
        const classMemberRes = convertToCamelCase(getClassMemberData.data);
        
        const getClassroom = await classroomService.getClassroomByClassroomCode(classMemberRes);

        const getClassroomSubject = await classroomSubjectService.getListClassroomSubjectByClassroomCode(classMemberRes);

        if(getClassroomSubject == null || getClassroomSubject.length == 0) {
            throw new Error('Subject not found in classroom');
        }

        const { data, error } = await supabase.from('kanban').insert([
        {
            kanban_name: kanbanData.kanbanName,
            kanban_descr: kanbanData.kanbanDescr,
            class_member_id: kanbanData.classMemberId,
            subject_code: kanbanData.subjectCode,
            deadline: kanbanData.deadline,
            created_by: kanbanData.createdBy,
            updated_by: kanbanData.createdBy
        }
        ]).select('*');

        if(error){
            throw new Error(`Error creating kanban: ${error.message}`);
        }

        return data[0];
    }

    //update kanban to in progress
    async updateKanbanToInProgress(kanbanId) {
        const kanbanData = await this.getKanbanById(kanbanId);

        if(kanbanData == null || kanbanData.length == 0) {
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

        if(kanbanData == null || kanbanData.length == 0) {
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

        if(kanbanData == null || kanbanData.length == 0) {
            throw new Error('Kanban not found');
        }

        const { data, error } = await supabase.from('kanban').delete().eq('kanban_id', kanbanId).select('*');
        return data;
    }

    //get list kanban by user
    async getListKanbanByUser(userId) {
        const { data, error } = await supabase.from('kanban').select('*').eq('class_member_id', userId);

        if(data == null || data.length == 0) {
            throw new Error('Kanban not found');
        }

        return data;
    }

    //get list kanban by user and month
    async getListKanbanByUserAndMonth(userId, month) {
        const { data, error } = await supabase.from('kanban').select('*').eq('class_member_id', userId).eq('deadline', month);

        if(data == null || data.length == 0) {
            throw new Error('Kanban not found');
        }

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


module.exports = new kanbanService();