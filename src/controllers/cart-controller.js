import express from 'express';
import { metricsLogError, parseError } from 'prom-nodejs-client';

// Service imports
import mysqlService from '../services/mysql-service.js';
import redisService from '../services/redis-service.js';

// use cases imports & constants
import { createCart, deleteCart, getCartById, listCarts, updateCart } from '../usecases/cart-usecases.js';

/**
 * Controller function to get the list of carts
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const listCartsController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const { skip, limit } = req.query;
  const searchKey = base64Helper.decode(req.query.search_key);
  try {
    const response = await listCarts(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
    res.status(200).json({
      message: 'carts retrieved',
      data: response,
    });
  } catch (ex) {
    metricsLogError('listCartsController: ', ex);
    console.log('listCartsController: ', parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || 'server error, Please try again',
    });
  }
};

/**
 * Controller function to get the cart by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const getCartByIdController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const cartId = parseInt(req.params.cartId);
  try {
    const response = await getCartById(userId, cartId, null, { mysqlService, redisService });

    if (response == null) {
      return res.status(404).json({
        message: 'cart not found',
      });
    }
    res.status(200).json({
      message: 'cart retrieved',
      data: response,
    });
  } catch (ex) {
    metricsLogError('getCartByIdController: ', ex);
    console.log('getCartByIdController: ', parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || 'server error, Please try again',
    });
  }
};

/**
 * Controller function to create a cart item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const createCartController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const { cart_name, cart_description, cart_quantity, cart_image } = req.body;
  try {
    const response = await createCart(userId, { cart_name, cart_description, cart_quantity, cart_image }, { mysqlService, redisService });
    res.status(201).json({
      message: 'cart created',
      data: response,
    });
  } catch (ex) {
    metricsLogError('createCartController: ', ex);
    console.log('createCartController: ', parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || 'server error, Please try again',
    });
  }
};

/**
 * Controller function to update a cart item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const updateCartController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const cartId = parseInt(req.params.cartId);
  const { cart_name, cart_description, cart_quantity, cart_image } = req.body;
  try {
    const cart_exist = await getCartById(userId, cartId, null, { mysqlService, redisService });
        if (cart_exist == null) {
        return res.status(404).json({
        message: "cart item not found",
        data: null,
      });
    }
    const response = await updateCart(userId, cartId, { cart_name, cart_description, cart_quantity, cart_image }, { mysqlService, redisService });
    res.status(200).json({
      message: 'cart updated',
      data: response,
    });
  } catch (ex) {
    metricsLogError('updateCartController: ', ex);
    console.log('updateCartController: ', parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || 'server error, Please try again',
    });
  }
};

/**
 * Controller function to delete a cart item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const deleteCartController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const cartId = parseInt(req.params.cartId);
  try {
    const cart_exist = await getCartById(userId, cartId, null, { mysqlService, redisService });
    if (cart_exist == null) {
      return res.status(404).json({
        message: 'cart item not found',
        data: null,
      });
    }
    await deleteCart(userId, cartId, { mysqlService, redisService });
    res.status(200).json({
      message: 'cart deleted',
    });
  } catch (ex) {
    metricsLogError('deleteCartController: ', ex);
    console.log('deleteCartController: ', parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || 'server error, Please try again',
    });
  }};


  /**
   * export controllers
   */

  const cartControllers = {
    listCartsController,
    getCartByIdController,
    createCartController,
    updateCartController,
    deleteCartController,
  };

export default cartControllers;