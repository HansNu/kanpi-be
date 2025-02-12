const userService = require('../services/userService');
const model = require('../models/index');
const joi = require ('joi');

const AddUser = async (req, res) => {
    try {
        const userData = model.usersObj.toDatabaseFormat(req.body);
        const newUser = await userService.addUser(userData);
        
        res.status(200).json({
            message: 'User added successfully',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add user',
            error: error.message
        });
    }
};


const GetUserByUserId = async (req, res) => {
    const reqById = model.reqByIdObj.toDatabaseFormat(req.body);
    const getUser = await userService.getUserByUserId(reqById.id);

    res.status(200).json({
        data: getUser
    })
};

const GetUserByEmail = async (req, res) => {
    const { email } = req.body;
    const getUser = await userService.getUserByEmail(email);

    res.status(200).json({
        data: getUser
    })
};

const Login = async (req, res) => {
    try {
        const loginData = model.reqLoginObj.toDatabaseFormat(req.body);

        const login = await userService.login(loginData);

        res.status(200).json({
            LoginValid: login
        });
    } catch (error) {
        res.status(200).json({
            LoginValid: false
        });
    }
};


module.exports = {AddUser, GetUserByUserId, Login, GetUserByEmail};
