const userService = require('../services/userService');
const usersObj = require('../models/usersObj');

const AddUser = async (req, res) => {
    try {
        const { name, email, password, userStat } = req.body;
        const user = new usersObj(name, email, password, userStat);
        console.log(user);
        const userData = await userService.addUser(user);

        res.status(200).json({
            message: 'User added successfully',
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add user',
            error: error.message
        });
    }
};

const GetUserByUserId = async (req, res) => {
    const { userId } = req.body;
    const getUser = await userService.getUserByUserId(userId);

    res.status(200).json({
        data: getUser
    })
}


module.exports = {AddUser, GetUserByUserId};
