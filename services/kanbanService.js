const supabase = require('./supabaseClient');
const classroomMemberService = require('./classroomMemberService');
const classroomService = require('./classroomService');
const classroomSubjectService = require('./classroomSubjectService');
const model = require('../models/index');
const _ = require('lodash');
const userService = require('./userService');

class kanbanService {

    async getKanbanById(kanbanId) {
        const { data, error } = await supabase.from('kanban').select('*').eq('kanban_id', kanbanId);
        
        return data[0];
    }
    
    async getListKanbanByUser(userId) {
        const { data, error } = await supabase
            .from('kanban')
            .select('*')
            .eq('user_id', userId);
    
        if (!data || data.length === 0) {
            return 'Kanban not found';
        }
    
        const subjectCodes = data.map(item => item.subject_code);
    
        const { data: subjects, error: subjectError } = await supabase
            .from('classroom_subjects')
            .select('subject_name, subject_code')
            .in('subject_code', subjectCodes);
    
        if (subjectError) {
            return 'Failed to fetch subjects';
        }
    
        const kanbanWithSubjects = data.map(kanban => ({
            ...kanban,
            subject: subjects.find(subject => subject.subject_code === kanban.subject_code) || null
        }));
    
        const currentDate = new Date();
    
        for(const kanban of kanbanWithSubjects) {
            const deadlineDt = kanban.deadline ? new Date(kanban.deadline) : null;
        
            let kanbanStat = kanban.kanban_stat;
    
            if(deadlineDt && deadlineDt < currentDate && kanbanStat != 'Done' && kanbanStat != 'Approved') {
                kanbanStat = 'Late';
            }
    
            const updateLate = await supabase.from('kanban').update({ kanban_stat: kanbanStat }).eq('kanban_id', kanban.kanban_id).select('*');
    
            if (updateLate.error) {
                return error('Error updating kanban status:', updateLate.error);
            }
        }
    
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
    
        const subjectCodes = data.map(item => item.subject_code);
    
        const { data: subjects, error: subjectError } = await supabase
            .from('classroom_subjects')
            .select('subject_name, subject_code')
            .in('subject_code', subjectCodes);
    
        if (subjectError) {
            return 'Failed to fetch subjects';
        }
    
        const kanbanWithSubjects = data.map(kanban => ({
            ...kanban,
            subject: subjects.find(subject => subject.subject_code === kanban.subject_code) || null
        }));
    
        return kanbanWithSubjects;
    
    }
    
    async getListKanbanByUserAndClassroom(req) {
        const { data, error } = await supabase.from('kanban').select('*')
            .eq('user_id', req.userId).eq('classroom_code', req.classroomCode);
    
            const subjectCodes = data.map(item => item.subject_code);
    
            const { data: subjects, error: subjectError } = await supabase
                .from('classroom_subjects')
                .select('subject_name, subject_code')
                .in('subject_code', subjectCodes);
        
            if (subjectError) {
                return 'Failed to fetch subjects';
            }
        
            const kanbanWithSubjects = data.map(kanban => ({
                ...kanban,
                subject: subjects.find(subject => subject.subject_code === kanban.subject_code) || null
            }));

            const currentDate = new Date();
    
            for(const kanban of kanbanWithSubjects) {
                const deadlineDt = kanban.deadline ? new Date(kanban.deadline) : null;
            
                let kanbanStat = kanban.kanban_stat;
        
                if(deadlineDt && deadlineDt < currentDate && kanbanStat != 'Done' && kanbanStat != 'Approved') {
                    kanbanStat = 'Late';
                }
        
                const updateLate = await supabase.from('kanban').update({ kanban_stat: kanbanStat }).eq('kanban_id', kanban.kanban_id).select('*');
        
                if (updateLate.error) {
                    return error('Error updating kanban status:', updateLate.error);
                }
            }
        
            return kanbanWithSubjects;
    }
    
    async getKanbanCountByUserId(memberId) {
        const existingMember = await classroomMemberService.getClassroomMemberByMemberId(memberId);
        if (!existingMember) {
            return { error: "User Not Found" };
        }
    
        const statuses = ["Pending", "In Progress", "Done", "Approved", "Rejected", "Late"];
        
        const kanbanCounts = {
            Pending: 0,
            "In Progress": 0,
            Done: 0,
            Approved: 0,
            Rejected: 0,
            Late: 0 
        };
    
        for (const status of statuses) {
            const { count, error } = await supabase
                .from("kanban")
                .select("*", { count: "exact" })
                .eq("member_id", memberId)
                .eq("kanban_stat", status);
    
            if (error) {
                return console.error(`Error fetching count for status "${status}":`, error);
                continue; 
            }
    
            kanbanCounts[status] = count; 
        }
    
        return {
            user: existingMember,  
            kanbanCounts          
        };
    }
    
    async getListKanbanByClassroomCode(req){
        const existingClass = await classroomService.getClassroomByClassroomCode(req);
        
        const {data, error} = await supabase.from('kanban').select('*').eq('classroom_code', req.classroomCode);
        if(data == null || data.length == 0){
            return `No Kanban found in classroom ${existingClass.classroom_name}`;
        }
    
        const subjectCodes = data.map(item => item.subject_code);
    
            const { data: subjects, error: subjectError } = await supabase
                .from('classroom_subjects')
                .select('subject_name, subject_code')
                .in('subject_code', subjectCodes);
        
            if (subjectError) {
                return 'Failed to fetch subjects';
            }
        
            const kanbanWithSubjects = data.map(kanban => ({
                ...kanban,
                subject: subjects.find(subject => subject.subject_code === kanban.subject_code) || null
            }));

            const currentDate = new Date();

            for(const kanban of kanbanWithSubjects) {
                const deadlineDt = kanban.deadline ? new Date(kanban.deadline) : null;
            
                let kanbanStat = kanban.kanban_stat;
        
                if(deadlineDt && deadlineDt < currentDate && kanbanStat != 'Done' && kanbanStat != 'Approved') {
                    kanbanStat = 'Late';
                }
        
                const updateLate = await supabase.from('kanban').update({ kanban_stat: kanbanStat }).eq('kanban_id', kanban.kanban_id).select('*');
        
                if (updateLate.error) {
                    return error('Error updating kanban status:', updateLate.error);
                }
            }
        
            return kanbanWithSubjects;
    }

    async getKanbanForCalendarByUserIdAndDate(req){
        const { data, error } = await supabase.from('kanban').select('*')
                                .eq('user_id', req.userId)
                                .in('kanban_stat', ['Pending' , 'In Progress'])
                                .gte('deadline', req.startDate)
                                .lte('deadline', req.endDate);
        
        if (error) return {message: error};
        
        return data;
    }

    async getKanbanForDashboardByUserId(req){
        const { data, error } = await supabase.from('kanban').select('*')
                                .eq('user_id', req.userId);

        if(data == null || data.length == 0){
            return `No Kanban found`;
        }
        if (error) return {message: error};
        
        let kanbanPendingCount = data.filter(k => k.kanban_stat == 'Pending').length;
        let kanbanInProgressCount = data.filter(k => k.kanban_stat == 'In Progress').length;
        let kanbanDoneCount = data.filter(k => k.kanban_stat == 'Done').length;
        let kanbanLateCount = data.filter(k => k.kanban_stat == 'Late').length;
        let kanbanApproved = data.filter(k => k.kanban_stat == 'Approved').length;
        let kanbanRejected = data.filter(k => k.kanban_stat == 'Rejected').length;

        let kanbanTotal = kanbanPendingCount + kanbanInProgressCount + kanbanDoneCount + kanbanLateCount + kanbanApproved + kanbanRejected;
        let kanbanProgress = ((kanbanApproved / kanbanTotal) * 100).toFixed(2);
        const achieve = kanbanProgress 
        
        return {
                Pending: kanbanPendingCount,
                InProgress: kanbanInProgressCount,
                Done: kanbanDoneCount,
                Late: kanbanLateCount,
                Approved: kanbanApproved,
                Rejected: kanbanRejected,
                Total : kanbanTotal,
                Progress : achieve
        };
    }

    async getKanbanClassroomForDashboardByUserId(req){
        const userClassroomList = await classroomService.getListClassroomByUserId(req.userId); 
        

        let kanbanClassroom = []
        for(const classroom of userClassroomList){
            
            const { data, error } = await supabase.from('kanban').select('*')
                                    .eq('user_id', req.userId).eq('classroom_code', classroom.classroom_code);
    
            if (error) return {message: error};
            
            let kanbanPendingCount = data.filter(k => k.kanban_stat == 'Pending').length;
            let kanbanInProgressCount = data.filter(k => k.kanban_stat == 'In Progress').length;
            let kanbanDoneCount = data.filter(k => k.kanban_stat == 'Done').length;
            let kanbanLateCount = data.filter(k => k.kanban_stat == 'Late').length;
            let kanbanApproved = data.filter(k => k.kanban_stat == 'Approved').length;
            let kanbanRejected = data.filter(k => k.kanban_stat == 'Rejected').length;
    
            let kanbanTotal = kanbanPendingCount + kanbanInProgressCount + kanbanDoneCount + kanbanLateCount + kanbanApproved + kanbanRejected;
            let kanbanProgress = ((kanbanApproved / kanbanTotal) * 100).toFixed(2);
            kanbanClassroom.push({
                classroom: `${classroom.classroom_code} - ${classroom.classroom_name}`,
                data: {
                    Pending: kanbanPendingCount,
                    InProgress: kanbanInProgressCount,
                    Done: kanbanDoneCount,
                    Late: kanbanLateCount,
                    Approved: kanbanApproved,
                    Rejected: kanbanRejected,
                    Total: kanbanTotal,
                    Progress: kanbanProgress
                }
            });
    
        }
        return kanbanClassroom;    
    }

    async addKanban(kanbanData) {
        const getClassMemberData = await supabase.from('classroom_member').select('*')
            .eq('user_id', kanbanData.userId).eq('classroom_code', kanbanData.classroomCode).single();

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
        return {
            Kanban : data,
            Message: 'Kanban Deleted Successfully'
        };
    }

    
    async rejectAllKanbanByUserId(req) {
        const checkMember = await classroomMemberService.getClassroomMemberByMemberIdAndClassroomCode(req);
    
        if (!checkMember || checkMember.length === 0) {
            return { message: "User not found" };
        }
    
        let query = supabase.from('kanban')
            .update({ kanban_stat: 'Rejected' })
            .eq('member_id', req.memberId)
            .eq('kanban_stat', 'Done');
    
        if (req.subjectCode || req.subjectCode != '') {
            query = query.eq('subject_code', req.subjectCode);
        }
    
        const { data, error } = await query.select('*');
    
        if (error) return error;
    
        if (!data || data.length === 0) {
            return { message: "No Kanban to Reject" };
        }
    
        return {
            Kanban: data,
            message: `All Kanban from user ${checkMember[0].member_name} have been Rejected`
        };
    }
    

    async approveAllKanbanByUserId(req) {
        const checkMember = await classroomMemberService.getClassroomMemberByMemberIdAndClassroomCode(req);

        if (checkMember == null || checkMember.length == 0) {
            return { message: "User not found" };
        }

        let query = supabase.from('kanban')
            .update({ kanban_stat: 'Approved' })
            .eq('member_id', req.memberId)
            .eq('kanban_stat', 'Done');
    
        if (req.subjectCode || req.subjectCode != '') {
            query = query.eq('subject_code', req.subjectCode);
        }
    
        const { data, error } = await query.select('*');
        if(error){
            return error
        }
        if(data == null || data.length == 0){
            return { message: "No Kanban to Approve" };
        }

        return {
            Kanban: data,
            message: `All Kanban from user ${checkMember[0].member_name} have been Approved`
        }
    }

    async rejectKanbanByKanbanId(kanbanId) {
        const existingKanban = await this.getKanbanById(kanbanId);
        if (!existingKanban){
            return { message: "Kanban not found" };
        }

        const { data, error } = await supabase.from('kanban').update({ kanban_stat: 'Rejected' }).eq('kanban_id', kanbanId)
                                .eq('kanban_stat', 'Done')
                                .select('*');
        if(error){
            return error
        }
        if(data == null || data.length == 0){
            return { message: "No Kanban to Reject" };
        }

        return {
            Kanban: data,
            message: `Kanban ${existingKanban.subject_name} have been Rejected`
        }
    }
    
    async approveKanbanByKanbanId(kanbanId) {
        const existingKanban = await this.getKanbanById(kanbanId);
        if (!existingKanban){
            return { message: "Kanban not found" };
        }

        const { data, error } = await supabase.from('kanban').update({ kanban_stat: 'Approved' }).eq('kanban_id', kanbanId)
                                .eq('kanban_stat', 'Done')
                                .select('*');
        if(error){
            return error
        }
        if(data == null || data.length == 0){
            return { message: "No Kanban to Approve" };
        }

        return {
            Kanban: data,
            message: `Kanban ${existingKanban.subject_code} have been Approved`
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