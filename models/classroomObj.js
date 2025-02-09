class classroomObj{
    constructor(classroomCode, classroomName, classroomMemberAmt, classroomStat){
        this.classroomCode = classroomCode;
        this.classroomName = classroomName;
        this.classroomMemberAmt = classroomMemberAmt;
        this.classroomStat = classroomStat;

    }

    toDatabaseFormat(){
        return{
            classroom_code : this.classroomCode,
            classroom_name : this.classroomName,
            classroom_member_amt : this.classroomMemberAmt,
            classroom_stat : this.classroomStat
        }
    }
}

module.exports = classroomObj;