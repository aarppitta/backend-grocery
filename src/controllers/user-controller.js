import express from 'express';
import { metricsLogError, parseError } from 'prom-nodejs-client';

// Service imports
import mysqlService from '../services/mysql-service.js';
import redisService from '../services/redis-service.js';

// use cases imports & constants
import { createUser, deleteUser, getUserById, listUsers, updateUser } from '../usecases/user-usecases.js';

// helper imports
import base64Helper from '../helpers/base64-helper.js';

/**
 * Controller function to get the list of users
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */


const listUsersController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { skip, limit } = req.query;
    const searchKey = base64Helper.decode(req.query.search_key);
    try {
        const response = await listUsers(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
        res.status(200).json({
        message: "users retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("listUsersController: ", ex);
        console.log("listUsersController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to get the user by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */


const getUserByIdController = async (req, res) => {
    const userId = req.auth.user.user_id;
    try {
        const response = await getUserById(userId, null, { mysqlService, redisService });

        if (response == null) {
        return res.status(404).json({
            message: "user not found",
        });
        }
        res.status(200).json({
        message: "user retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("getUserByIdController: ", ex);
        console.log("getUserByIdController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to create a user item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const createUserController = async (req, res) => {
    // const userId = req.auth.user.user_id;
    const { email, password, name, display_name, gender } = req.body;
    try {
        const response = await createUser( { email, password, name, display_name, gender },null, { mysqlService, redisService });
        res.status(200).json({
        message: "user created",
        data: response,
        });
    } catch (ex) {
        metricsLogError("createUserController: ", ex);
        console.log("createUserController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to update a user item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const updateUserController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { email, password, name, role } = req.body;
    try {
        const user_exist = await getUserById(userId, null, { mysqlService, redisService });
        if (user_exist == null) {
        return res.status(404).json({
        message: "product not found",
        data: null,
      });
    }
        const response = await updateUser(userId, { email, password, name, role }, { mysqlService, redisService });
        res.status(200).json({
        message: "user updated",
        data: response,
        });
    } catch (ex) {
        metricsLogError("updateUserController: ", ex);
        console.log("updateUserController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to delete a user item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const deleteUserController = async (req, res) => {
    const userId = req.auth.user.user_id;
    try {
        const user_exist = await getUserById(userId, null, { mysqlService, redisService });
        if (user_exist == null) {
        return res.status(404).json({
        message: "user not found",
        data: null,
      });
    }
        const response = await deleteUser(userId, { mysqlService, redisService });
        res.status(200).json({
        message: "user deleted",
        data: response,
        });
    } catch (ex) {
        metricsLogError("deleteUserController: ", ex);
        console.log("deleteUserController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };

const userController= {
    listUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController
};

export default userController;