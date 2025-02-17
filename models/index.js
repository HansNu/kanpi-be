const usersObj = require('./usersObj.js');
const classroomObj = require('./classroomObj.js');
const classroomMemberObj = require('./classroomMemberObj.js');
const userReq = require('./reqModel/userReq/userReq.js');
const genericObj = require('./reqModel/genericObj.js');
const classroomReq = require('./reqModel/classroomReq/classroomReq.js');

module.exports = {
  usersObj,
  classroomObj,
  classroomMemberObj,
  ...userReq,
  ...genericObj,
  ...classroomReq
};
