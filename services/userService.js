const supabase = require('./supabaseClient');
const commonService = require('./commonService');
const model = require('../models/index');

const getUserByUserId = async (userId) => {
    const { data, error} = await supabase.from('users').select('*').eq('user_id', userId);
    return data[0];
}

const getUserByEmail = async (email) => {
    const { data, error} = await supabase.from('users').select('*').eq('email', email);
    return data[0];
}

const addUser = async (userData) => {
    const userExisting = await getUserByEmail(userData.email);

    if (userExisting) {
        throw new Error('Email already exists');
    }

    const { data, error } = await supabase.from('users').insert(userData).select('*');

    if (error) {
        console.log(error);
        throw new Error('Failed to add user, invalid data');
    }
    return data;
};


const login = async (loginData) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', loginData.email).eq('password', loginData.password);

    userLogin = data;

    if (userLogin.length != 0){
        return {
            user : userLogin, 
            validity: true};
    } else
        return {
            message: "No user exists with this email", 
            validity: false};
}; 

module.exports = { addUser, getUserByUserId, getUserByEmail, login};
