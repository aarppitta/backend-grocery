// Library imports
import Express from "express";
import { metricsLogError, parseError } from "prom-nodejs-client";

// Service imports
import mysqlService from "../services/mysql-service.js";
import redisService from "../services/redis-service.js";

// use cases imports & constants
import { createAddress, deleteAddress, getAddressById, listAddresses, updateAddress } from "../usecases/address-usecases.js";

// helper imports
import base64Helper from "../helpers/base64-helper.js";
/**
 * Controller function to get the list of address
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */
const listAddressesController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const { skip, limit } = req.query;
  const searchKey = base64Helper.decode(req.query.search_key);
  try {
    const response = await listAddresses(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
    res.status(200).json({
      message: "addresses retrieved",
      data: response,
    });
  } catch (ex) {
    metricsLogError("listAddressesController: ", ex);
    console.log("listAddressesController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to get the address by id
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 */
const getAddressByIdController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const addressId = parseInt(req.params.addressId);
  try {
    const response = await getAddressById(userId, addressId, null, { mysqlService, redisService });

    if (response == null) {
      return res.status(404).json({
        message: "address not found",
      });
    }
    res.status(200).json({
      message: "address retrieved",
      data: response,
    });
  } catch (ex) {
    metricsLogError("getAddressByIdController: ", ex);
    console.log("getAddressByIdController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to create a address item
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 * @returns { Promise<void> }
 */
const createAddressController = async (req, res) => {
  const userId = parseInt(req.auth.user.user_id);
  const { address_type, address_line_1, address_line_2, city ,state, country , pincode , mobile } = req.body;
  try {
    const response = await createAddress(userId, { address_type, address_line_1, address_line_2, city ,state, country , pincode , mobile } , null, { mysqlService, redisService });
    res.status(201).json({
      message: "address created successfully",
      data: response,
    });
  } catch (ex) {
    metricsLogError("createAddressController: ", ex);
    console.log("createAddressController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to update a address item
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 * @returns { Promise<void> }
 */
const updateAddressController = async (req, res) => {
  const userId = parseInt(req.auth.user.user_id);
  const addressId = parseInt(req.params.addressId);
  const { address_type , address_line_1 , address_line_2 , city ,state , country , pincode , mobile } = req.body;
  try {
    const address_exist = await getAddressById(userId, addressId, null, { mysqlService, redisService });
    if (address_exist == null) {
      return res.status(404).json({
        message: "address ticket not found",
        data: null,
      });
    }
    const response = await updateAddress(userId, addressId, { address_type , address_line_1 , address_line_2 , city ,state , country , pincode , mobile }, null, { mysqlService, redisService });
    res.status(200).json({
      message: "address updated successfully",
      data: response,
    });
  } catch (ex) {
    metricsLogError("updateAddressController: ", ex);
    console.log("updateAddressController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to delete a Address item
 * @param { Express.Request } req - The request object
 * @param { Express.Response } res - The response object
 * @returns { Promise<void> }
 */
const deleteAddressController = async (req, res) => {
  const userId = parseInt(req.auth.user.user_id);
  const addressId = parseInt(req.params.addressId);
  try {
    const address_exists = await getAddressById(userId, addressId, null, { mysqlService, redisService });
    if (address_exists == null) {
      return res.status(404).json({
        message: "address not found",
        data: null,
      });
    }

    const response = await deleteAddress(userId, addressId, { mysqlService, redisService });
    res.status(200).json({
      message: "address item deleted successfully",
      data: response,
    });
  } catch (ex) {
    metricsLogError("deleteAddressController: ", ex);
    console.log("deleteAddressController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * export all controller
 */
const addressController = {
  listAddressesController,
  getAddressByIdController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
};

export default addressController;