import express from 'express';
import { metricsLogError, parseError } from 'prom-nodejs-client';

// Service imports
import mysqlService from '../services/mysql-service.js';
import redisService from '../services/redis-service.js';

// use cases imports & constants
import { createOrder, deleteOrder, getOrderById, listOrders, updateOrder } from '../usecases/order-usecases.js';

/**
 * Controller function to get the list of orders
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const listOrdersController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { skip, limit } = req.query;
    const searchKey = base64Helper.decode(req.query.search_key);
    try {
        const response = await listOrders(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
        res.status(200).json({
        message: "orders retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("listOrdersController: ", ex);
        console.log("listOrdersController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };

/**
 * Controller function to get the order by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const getOrderByIdController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const orderId = parseInt(req.params.orderId);
    try {
        const response = await getOrderById(userId, orderId, null, { mysqlService, redisService });

        if (response == null) {
        return res.status(404).json({
            message: "order not found",
        });
        }
        res.status(200).json({
        message: "order retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("getOrderByIdController: ", ex);
        console.log("getOrderByIdController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };

/**
 * Controller function to create a order item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const createOrderController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const { order_date, order_status, order_total, order_payment_status, order_payment_method, order_payment_date, order_delivery_date, order_delivery_status, order_delivery_address } = req.body;
    try {
        const response = await createOrder(userId, { order_date, order_status, order_total, order_payment_status, order_payment_method, order_payment_date, order_delivery_date, order_delivery_status, order_delivery_address }, null, { mysqlService, redisService });
        res.status(201).json({
        message: "order created",
        data: response,
        });
    } catch (ex) {
        metricsLogError("createOrderController: ", ex);
        console.log("createOrderController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to update a order item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const updateOrderController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const orderId = parseInt(req.params.orderId);
    const { order_date, order_status, order_total, order_payment_status, order_payment_method, order_payment_date, order_delivery_date, order_delivery_status, order_delivery_address } = req.body;
    
    try {
        const order_exist = await getOrderById(userId, productId, null, { mysqlService, redisService });
        if (order_exist == null) {
        return res.status(404).json({
        message: "product not found",
        data: null,
      });
    }
        const response = await updateOrder(userId, orderId, { order_date, order_status, order_total, order_payment_status, order_payment_method, order_payment_date, order_delivery_date, order_delivery_status, order_delivery_address }, null, { mysqlService, redisService });
        res.status(200).json({
        message: "order updated",
        data: response,
        });
    } catch (ex) {
        metricsLogError("updateOrderController: ", ex);
        console.log("updateOrderController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };

/**
 * Controller function to delete a order item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const deleteOrderController = async (req, res) => {
    const userId = req.auth.user.user_id;
    const orderId = parseInt(req.params.orderId);
    try {
        const order_exist = await getOrderById(userId, orderId, null, { mysqlService, redisService });
        if (order_exist == null) {
        return res.status(404).json({
        message: "order not found",
        data: null,
      });
    }
        const response = await deleteOrder(userId, orderId, null, { mysqlService, redisService });
        res.status(200).json({
        message: "order deleted",
        data: response,
        });
    } catch (ex) {
        metricsLogError("deleteOrderController: ", ex);
        console.log("deleteOrderController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * export all controller
 */

const orderController = {
    listOrdersController,
    getOrderByIdController,
    createOrderController,
    updateOrderController,
    deleteOrderController,
};

export default orderController;