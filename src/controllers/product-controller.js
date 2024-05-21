//Library imports
import express from "express"; 
import { metricsLogError, parseError } from "prom-nodejs-client";

// Service imports
import mysqlService from "../services/mysql-service.js";
import redisService from "../services/redis-service.js";

//import helper functions
import base64Helper from "../helpers/base64-helper.js";

// use cases imports & constants
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../usecases/product-usecases.js";

/**
 * Controller function to get the list of products
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const listProductsController = async (req, res) => {
    const { skip, limit } = req.query;
    const searchKey = base64Helper.decode(req.query.search_key);
    try {
        const response = await listProducts( { searchKey }, null, skip, limit, { mysqlService, redisService });
        res.status(200).json({
        message: "products retrieved",
        data: response,
        });
    } catch (ex) {
        metricsLogError("listProductsController: ", ex);
        console.log("listProductsController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };

/**
 * Controller function to get the product by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const getProductByIdController = async (req, res) => {
    const productId = parseInt(req.params.productId);
    try {
        const response = await getProductById(productId, null, { mysqlService, redisService });

        if (response == null) {
        return res.status(404).json({
            message: "product not found",
        });
        }
        res.status(200).json({
        message: "product retrieved",
        data: response,
        });
    } catch (ex) {

        metricsLogError("getProductByIdController: ", ex);
        console.log("getProductByIdController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to create a product item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @returns { Promise<void> }
 */

const createProductController = async (req, res) => {
    // const userId = parseInt(req.auth.user.user_id);
    const { name, price, description ,specifications, image, stock, isFeatured } = req.body;
    try {
        const response = await createProduct({ name, price, description ,specifications, image, stock, isFeatured  }, null, { mysqlService, redisService });

        res.status(201).json({
        message: "product created",
        data: response,
        });
    } catch (ex) {
        metricsLogError("createProductController: ", ex);
        console.log("createProductController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to update a product item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @returns { Promise<void> }
 */

const updateProductController = async (req, res) => {
    
    const productId = parseInt(req.params.productId);
    const { name, price, description, specifications , image, stock, isFeatured } = req.body;
    try {
        const product_exist = await getProductById(productId, { mysqlService, redisService });
        if (product_exist == null) {
        return res.status(404).json({
        message: "product not found",
        data: null,
      });
    }
        const response = await updateProduct(productId, { name, price, description, specifications , image, stock, isFeatured }, null, { mysqlService, redisService });
        res.status(200).json({
        message: "product updated",
        data: response, 
        });
    } catch (ex) {
        metricsLogError("updateProductController: ", ex);
        console.log("updateProductController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };


/**
 * Controller function to delete a product item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @returns { Promise<void> }
 */

const deleteProductController = async (req, res) => {
    // const userId = req.auth.user.user_id;
    const productId = parseInt(req.params.productId);
    try {
        const product_exist = await getProductById(productId, null, { mysqlService, redisService });
        if (product_exist == null) {
        return res.status(404).json({
            message: "product not found",
            data: null,
            });
        }
        const response = await deleteProduct(productId, { mysqlService, redisService });
        res.status(200).json({
        message: "product deleted",
        data: response,
        });
    } catch (ex) {
        metricsLogError("deleteProductController: ", ex);
        console.log("deleteProductController: ", parseError(ex));
        res.status(ex?.statusCode || 500).json({
        message: ex?.message || "server error, Please try again",
        });
    }
    };

/**
 * export all controller
 */

const productController = {
    listProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
};

export default productController;