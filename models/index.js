const usersObj = require('./usersObj.js');
const classroomObj = require('./classroomObj.js');
const userReq = require('./reqModel/userReq/userReq.js');

module.exports = {
  usersObj,
  classroomObj,
  ...userReq
};
