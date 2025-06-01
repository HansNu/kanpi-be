const supabase = require('./supabaseClient');
const model = require('../models/index');
const kanbanService = require('../services/kanbanService');
const { get } = require('lodash');

class userService {

    async getUserByUserId(userId) {
        const { data, error } = await supabase.from('users').select('*').eq('user_id', userId);
        return data[0];
    }

    async getUserByEmail(email) {
        const { data, error } = await supabase.from('users').select('*').eq('email', email);
        return data[0];
    }

    async addUser(userData) {
        const userExisting = await this.getUserByEmail(userData.email);

        if (userExisting) {
            throw new Error('Email already exists');
        }

        const { data, error } = await supabase.from('users').insert(userData).select('*');

        if (error) {
            console.log(error);
            throw new Error('Failed to add user, invalid data');
        }
        return data;
    }

    async login(loginData) {
        const { data, error } = await supabase.from('users').select('*').eq('email', loginData.email).eq('password', loginData.password);

        const userLogin = data;

        if (userLogin.length != 0) {
            return {
                user: userLogin,
                validity: true
            };
        } else {
            return {
                message: "No user exists with this email",
                validity: false
            };
        }
    }

    async updateUserData(user) {
        const classroomMember = require('../services/classroomMemberService');
        const classroomAdmin = require('../services/classroomAdminService');
        const getExisting = await this.getUserByUserId(user.userId);
        if (!getExisting) {
            return { message: `User Not Found` };
        }

        const newName = user.name ? user.name : getExisting.name;
        const newEmail = user.email ? user.email : getExisting.email;
        const newPassword = user.password ? user.password : getExisting.password;

        if(user.currentPassword != getExisting.password || !user.currentPassword){
            return {Message: `Password does not match`};
        }


        const { data, error } = await supabase.from('users')
            .update({
                name: newName,
                email: newEmail,
                password: newPassword
            })
            .eq('user_id', user.userId)
            .select('*');


        const checkMember = await classroomMember.getClassroomMemberByUserId(user.userId);
        if (checkMember && checkMember.length > 0) {
            await supabase.from('classroom_member')
                .update({ member_name: newName })
                .eq('user_id', user.userId);
        }

        const checkAdmin = await classroomAdmin.getClassroomSuperAdminByUserId(user);
        if (checkAdmin && checkAdmin.length > 0) {
            await supabase.from('classroom_admin')
                .update({ member_name: newName })
                .eq('user_id', user.userId);
        }

        return {
            message: `User updated successfully`,
            userData: data
        }
    }

    async forgotPassword(paw){
        const checkEmail = await supabase.from('users').select('*').eq('email', paw.email);
        if(checkEmail.data.length == 0 || checkEmail == null){
            return {message: `Email not found`}
        }

        const updatePw = await supabase.from('users').update({password: paw.password}).eq('email', paw.email).select('*');

        return {
            message: `User updated successfully`,
            userData: updatePw.data
        }
    }
}

module.exports = new userService();

