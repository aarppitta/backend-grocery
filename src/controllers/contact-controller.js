import express from 'express';
import { metricsLogError, parseError } from 'prom-nodejs-client';

// Service imports
import mysqlService from '../services/mysql-service.js';
import redisService from '../services/redis-service.js';

// import helper functions
import base64Helper from '../helpers/base64-helper.js';

// use cases imports & constants
import { createContact, deleteContact, getContactById, listContacts, updateContact } from '../usecases/contact-usecases.js';

/**
 * Controller function to get the list of users
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */


const listContactsController = async (req, res) => {
    const { skip, limit } = req.query;
    const searchKey = base64Helper.decode(req.query.search_key);
    try {
        const response = await listContacts({ searchKey }, null, skip, limit, { mysqlService, redisService });
        res.status(200).json({
        message: "contacts retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("listContactsController: ", ex);
        console.log("listContactsController: ", parseError(ex));
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


const getContactByIdController = async (req, res) => {
    const contactId = parseInt(req.params.contactId);
    try {
        const response = await getContactById(contactId, null, { mysqlService, redisService });

        if (response == null) {
        return res.status(404).json({
            message: "contact not found",
        });
        }
        res.status(200).json({
        message: "contact retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("getContactByIdController: ", ex);
        console.log("getContactByIdController: ", parseError(ex));
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

const createContactController = async (req, res) => {
    // const userId = req.auth.user.user_id;
    const { fname, lname, email, message } = req.body;
    try {
        const response = await createContact( { fname, lname, email, message }, null, { mysqlService, redisService });
        res.status(201).json({
        message: "contact created",
        data: response,
        });
    } catch (ex) {
        metricsLogError("createContactController: ", ex);
        console.log("createContactController: ", parseError(ex));
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

const updateContactController = async (req, res) => {
    // const userId = req.auth.user.user_id;
    const contactId = parseInt(req.params.contactId);
    const { contact_name, contact_email, contact_mobile, contact_message } = req.body;
    try {

        const contact_exist = await getContactById(contactId, null, { mysqlService, redisService });
        if (contact_exist == null) {
        return res.status(404).json({
        message: "contact not found",
        data: null,
      });
    }
        const response = await updateContact(userId, contactId, { contact_name, contact_email, contact_mobile, contact_message }, { mysqlService, redisService });
        res.status(200).json({
        message: "contact updated",
        data: response,
        });
    } catch (ex) {
        metricsLogError("updateContactController: ", ex);
        console.log("updateContactController: ", parseError(ex));
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

const deleteContactController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const contactId = parseInt(req.params.contactId);
    try {
        const contact_exist = await getContactById(userId, contactId, null, { mysqlService, redisService });
        if (contact_exist == null) {
        return res.status(404).json({
        message: "contact not found",
        data: null,
      });
    }
        const response = await deleteContact(userId, contactId, { mysqlService, redisService });
        res.status(200).json({
        message: "contact deleted",
        data: response,
        });
    } catch (ex) {
        metricsLogError("deleteContactController: ", ex);
        console.log("deleteContactController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * export all controller
 */


const contactController = {
    listContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController,
};

export default contactController;