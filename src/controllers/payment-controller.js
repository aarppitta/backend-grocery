import express from 'express';

// Import the necessary functions from the services
import redisService from '../services/redis-service.js';
import mysqlService from '../services/mysql-service.js';

// Import the necessary functions from the usecases
import { createPayment, deletePayment, getPaymentById, listPayments, updatePayment } from '../usecases/payment-usecases.js';

/**
 * Controller function to get the list of payments
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const listPaymentsController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { skip, limit } = req.query;
    const searchKey = base64Helper.decode(req.query.search_key);
    try {
        const response = await listPayments(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
        res.status(200).json({
        message: "payments retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("listPaymentsController: ", ex);
        console.log("listPaymentsController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to get the payment by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const getPaymentByIdController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const paymentId = parseInt(req.params.paymentId);
    try {
        const response = await getPaymentById(userId, paymentId, null, { mysqlService, redisService });

        if (response == null) {
        return res.status(404).json({
            message: "payment not found",
        });
        }
        res.status(200).json({
        message: "payment retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("getPaymentByIdController: ", ex);
        console.log("getPaymentByIdController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to create a payment item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const createPaymentController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { amount } = req.body;
    try {
        const response = await createPayment(userId, { amount }, { mysqlService, redisService });
        res.status(200).json({
        message: "payment created",
        data: response,
        });
    } catch (ex) {
        metricsLogError("createPaymentController: ", ex);
        console.log("createPaymentController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to update a payment item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const updatePaymentController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const paymentId = parseInt(req.params.paymentId);
    const { amount } = req.body;
    try {
        const payment_exist = await getPaymentById(userId, paymentId, null, { mysqlService, redisService });
        if (payment_exist == null) {
        return res.status(404).json({
        message: "payment not found",
        data: null,
      });
    }
        const response = await updatePayment(userId, paymentId, { amount }, { mysqlService, redisService });
        res.status(200).json({
        message: "payment updated",
        data: response,
        });
    } catch (ex) {
        metricsLogError("updatePaymentController: ", ex);
        console.log("updatePaymentController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to delete a payment item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const deletePaymentController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const paymentId = parseInt(req.params.paymentId);
    try {
        const payment_exist = await getPaymentById(userId, paymentId, null, { mysqlService, redisService });
        if (payment_exist == null) {
        return res.status(404).json({
        message: "payment not found",
        data: null,
      });
    }
        const response = await deletePayment(userId, paymentId, { mysqlService, redisService });
        res.status(200).json({
        message: "payment deleted",
        data: response,
        });
    } catch (ex) {
        metricsLogError("deletePaymentController: ", ex);
        console.log("deletePaymentController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * export all controller
 */

const paymentController = {
    listPaymentsController,
    getPaymentByIdController,
    createPaymentController,
    updatePaymentController,
    deletePaymentController,
};

export default paymentController;