import express from "express";
import { metricsLogError, parseError } from "prom-nodejs-client";

// Service imports
import mysqlService from "../services/mysql-service.js";
import redisService from "../services/redis-service.js";

// use cases imports & constants
import { createWishlist, deleteWishlist, getWishlistById, listWishlists, updateWishlist } from "../usecases/wishlist-usecases.js";

/**
 * Controller function to get the list of wishlists
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const listWishlistsController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const { skip, limit } = req.query;
  const searchKey = base64Helper.decode(req.query.search_key);
  try {
    const response = await listWishlists(userId, { searchKey }, null, skip, limit, { mysqlService, redisService });
    res.status(200).json({
      message: "wishlists retrieved",
      data: response,
    });
  } catch (ex) {
    metricsLogError("listWishlistsController: ", ex);
    console.log("listWishlistsController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to get the wishlist by id
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const getWishlistByIdController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const wishlistId = parseInt(req.params.wishlistId);
  try {
    const response = await getWishlistById(userId, wishlistId, null, { mysqlService, redisService });

    if (response == null) {
      return res.status(404).json({
        message: "wishlist not found",
      });
    }
    res.status(200).json({
      message: "wishlist retrieved",
      data: response,
    });
  } catch (ex) {
    metricsLogError("getWishlistByIdController: ", ex);
    console.log("getWishlistByIdController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};


/**
 * Controller function to create a wishlist item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const createWishlistController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const { wishlist_name, wishlist_description, wishlist_quantity, wishlist_image } = req.body;
  try {
    const response = await createWishlist(userId, { wishlist_name, wishlist_description, wishlist_quantity, wishlist_image }, { mysqlService, redisService });
    res.status(201).json({
      message: "wishlist created",
      data: response,
    });
  } catch (ex) {
    metricsLogError("createWishlistController: ", ex);
    console.log("createWishlistController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

/**
 * Controller function to update a wishlist item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const updateWishlistController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const wishlistId = parseInt(req.params.wishlistId);
  const { wishlist_name, wishlist_description, wishlist_quantity, wishlist_image } = req.body;
  try {
    const wishlist_exist = await getWishlistById(userId, cartId, null, { mysqlService, redisService });
        if (wishlist_exist == null) {
        return res.status(404).json({
        message: "cart item not found",
        data: null,
      });
    }
    const response = await updateWishlist(userId, wishlistId, { wishlist_name, wishlist_description, wishlist_quantity, wishlist_image }, { mysqlService, redisService });
    res.status(200).json({
      message: "wishlist updated",
      data: response,
    });
  } catch (ex) {
    metricsLogError("updateWishlistController: ", ex);
    console.log("updateWishlistController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }};

/**
 * Controller function to delete a wishlist item
 * @param { express.Request } req - The request object
 * @param { express.Response } res - The response object
 */

const deleteWishlistController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const wishlistId = parseInt(req.params.wishlistId);
  try {
    const wishlist_exist = await getWishlistById(userId, wishlistId, null, { mysqlService, redisService });
    if (wishlist_exist == null) {
      return res.status(404).json({
        message: "wishlist item not found",
        data: null,
      });
    }
    await deleteWishlist(userId, wishlistId, { mysqlService, redisService });
    res.status(200).json({
      message: "wishlist deleted",
    });
  } catch (ex) {
    metricsLogError("deleteWishlistController: ", ex);
    console.log("deleteWishlistController: ", parseError(ex));
    res.status(ex?.statusCode || 500).json({
      message: ex?.message || "server error, Please try again",
    });
  }
};

// Exporting the controllers

const wishlistController = {
    listWishlistsController,
    getWishlistByIdController,
    createWishlistController,
    updateWishlistController,
    deleteWishlistController,
    };

export default wishlistController;