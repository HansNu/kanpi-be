const userService = require('../services/userService');
const model = require('../models/index');
const joi = require ('joi');

class userController {

    async AddUser(req, res){
        try {
            const userData = model.usersObj.toDatabaseFormat(req.body);
            const newUser = await userService.addUser(userData);
            
            res.status(200).json({
                message: 'User added successfully',
                data: newUser
            });
        } catch (error) {
            res.status(500).json({
                    message: `Failed to add user, ${error.message}`            
        });
        }
    };

    async GetUserByUserId (req, res) {
        try {
            const reqById = model.reqByIdObj.toDatabaseFormat(req.body);
            const getUser = await userService.getUserByUserId(reqById.id);
            
            res.status(200).json({
                message: 'User retrieved by user ID successfully',
                data: getUser
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to retrieve user by user ID',
                error: error.message
            });
        }
    };
    
    
    async GetUserByEmail (req, res) {
        try {
            const { email } = req.body;
            const getUser = await userService.getUserByEmail(email);
            
            res.status(200).json({
                message: 'User retrieved by email successfully',
                data: getUser
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to retrieve user by email',
                error: error.message
            });
        }
    };
    
    async Login (req, res) {
        try {
            const loginData = model.reqLoginObj.toDatabaseFormat(req.body);
    
            const login = await userService.login(loginData);
    
            res.status(200).json({
                message: 'User logged in successfully',
                LoginValid: login
            });
        } catch (error) {
            res.status(200).json({
                message: 'Failed to login',
                LoginValid: false
            });
        }
    };

    async UpdateUserData(req, res){
        const update = await userService.updateUserData(req.body);
        res.status(200).json(update);
    }
    
    async ForgotPassword(req, res){
        const update = await userService.forgotPassword(req.body);
        res.status(200).json(update);
    }
}

module.exports = new userController();
