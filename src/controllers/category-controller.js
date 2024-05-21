import express from "express";
import { metricsLogError, parseError } from "prom-nodejs-client";

// Service imports
import mysqlService from "../services/mysql-service.js";
import redisService from "../services/redis-service.js";

//import helper functions
import base64Helper from "../helpers/base64-helper.js";

// use cases imports & constants
import { createCategory, deleteCategory, getCategoryById, listCategories, updateCategory } from "../usecases/category-usecases.js";

/**
 * Controller function to get the list of categories
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @param {number} skip
 * @param {number} limit
 * @param {{ mysqlService: any, redisService: any }} dependencies
 */

const listCategoriesController = async (req, res) => {
  // const userId = req.auth.user.user_id;
  const { skip=0, limit=1 } = req.query;
  const searchKey  = base64Helper.decode(req.query.search_key);

  try {
    const response = await listCategories({ searchKey }, null, skip, limit, { mysqlService, redisService });
    res.status(200).json({
      message: "categories retrieved",
      data: response,
    });
  } catch (ex) {
    metricsLogError("listCategoriesController: ", ex);
    console.log("listCategoriesController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to get the category by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const getCategoryByIdController = async (req, res) => {
  // const userId = req.auth.user.user_id;
  const categoryId = parseInt(req.params.categoryId);
  try {
    const response = await getCategoryById(categoryId, null, { mysqlService, redisService });

    if (response == null) {
      return res.status(404).json({
        message: "category not found",
      });
    }
    res.status(200).json({
      message: "category retrieved",
      data: response,
    });
  } catch (ex) {
    metricsLogError("getCategoryByIdController: ", ex);
    console.log("getCategoryByIdController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to create a category item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @returns { Promise<void> }
 */


const createCategoryController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const { name, description, image } = req.body;
  try {
    const response = await createCategory(userId, { name, description, image },null, { mysqlService, redisService });
    res.status(201).json({
      message: "category created",
      data: response,
    });
  } catch (ex) {
    metricsLogError("createCategoryController: ", ex);
    console.log("createCategoryController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to update a category item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @returns { Promise<void> }
 */

const updateCategoryController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const categoryId = parseInt(req.params.categoryId);
  const { name, image, description } = req.body;
  try {

    const category_exist = await getCategoryById(categoryId, null, { mysqlService, redisService });
    if (category_exist == null) {
      return res.status(404).json({
        message: "category not found",
        data: null,
      });
    }
    const response = await updateCategory( categoryId, { name, image, description }, { mysqlService, redisService });
    res.status(200).json({
      message: "category updated",
      data: response,
    });
  } catch (ex) {
    metricsLogError("updateCategoryController: ", ex);
    console.log("updateCategoryController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to delete a category item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 * @param {{ mysqlService: any, redisService: any }} dependencies
 * @returns { Promise<void> }
 */

const deleteCategoryController = async (req, res) => {
  // const userId = req.auth.user.user_id;
  const categoryId = parseInt(req.params.categoryId);
  try {
    const category_exist = await getCategoryById(categoryId, null,{ mysqlService, redisService });
    if (category_exist == null) {
      return res.status(404).json({
        message: "category not found",
        data: null,
      });
    }
    const response = await deleteCategory(categoryId, { mysqlService, redisService });
    res.status(200).json({
      message: "category deleted",
      data: response,
    });
  } catch (ex) {
    metricsLogError("deleteCategoryController: ", ex);
    console.log("deleteCategoryController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

const categoryController = {
  listCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
};

export default categoryController;

