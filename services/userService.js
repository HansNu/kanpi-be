const supabase = require('./supabaseClient');
const commonService = require('./commonService');

const addUser = async (user) => {
    const userData = user.toDatabaseFormat();
    
    const { data, error } = await supabase.from('users').insert(userData);

    if (error) {
        console.log(error);
        throw new Error('Failed to add user, invalid data');
    }
    return data;
};

const getUserByUserId = async (userId) => {
    const { data, error} = await supabase.from('users').select('*').eq('user_id', userId);

    if (data == 0) {
        console.log(error);
        throw new Error('User Not Found');
    }
    return data[0];
}



module.exports = { addUser, getUserByUserId };
