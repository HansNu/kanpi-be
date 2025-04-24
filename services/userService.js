const supabase = require('./supabaseClient');
const model = require('../models/index');

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
}

module.exports = new userService();

