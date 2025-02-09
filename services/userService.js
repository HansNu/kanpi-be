const supabase = require('./supabaseClient');
const commonService = require('./commonService');
const UsersObj = require('../models/usersObj');

const getUserByUserId = async (userId) => {
    const { data, error} = await supabase.from('users').select('*').eq('user_id', userId);
    
    if (data == 0) {
        console.log(error);
        throw new Error('User Not Found');
    }
    return data[0];
}

const addUser = async (user) => {
    user.userStat = true;
    const userData = user.toDatabaseFormat();
    
    //bikin get user by email jgn pake id
    // userCheck = new UsersObj();
    // userCheck = await getUserByUserId(userData.user_id);

    // if(user != null) {
    //     throw new Error('User already exists');
    // }

    const { data, error } = await supabase.from('users').insert(userData);

    if (error) {
        console.log(error);
        throw new Error('Failed to add user, invalid data');
    }
    return data;
};

const login = async (email, password) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password);

    if (data != null){
        return true;
    } else
        return false;
} 

module.exports = { addUser, getUserByUserId, login};
