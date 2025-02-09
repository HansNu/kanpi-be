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



module.exports = { addUser };
