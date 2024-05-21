/**
 * @module product-controller-validator
 */

import { body, param, query } from "express-validator";
import errorValidator, { parseSkipLimit } from "./validator.js";

/**
 * Validates if a given field is a numeric integer.
 * @param {string} field - The field to validate.
 * @returns {object} - The validation object.
 */

/**
 * Validates if a given field is a numeric integer greater than or equal to 1.
 *
 * @param {string} field - The name of the field being validated.
 * @returns {Function} A function that performs the validation.
 */

const isNumericInt = (field) =>
    param(field).custom((value) => {
        if (value.toString().includes(".")) {
        throw new Error(`${field} must not be a decimal or float`);
        }
        if (!Number.isInteger(Number(value))) {
        throw new Error(`${field} must be an integer`);
        }
        if (Number(value) < 1) {
        throw new Error(`${field} must be greater than or equal to 1`);
        }
        return true;
    });

/**
 * Validates if the productId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const productValidator = [body("name").notEmpty().withMessage("product_name is required").isLength({ max: 40 }).withMessage("productname must not be more than 40 characters"),
                                body("description").notEmpty().withMessage("product_description is required").isLength({ max: 100 }).withMessage("product description must not be more than 2100 characters"),
                                body("price").notEmpty().withMessage("product price is required").isNumeric().withMessage("product price must be a number"),
                                body("specifications").notEmpty().withMessage("specifications is required").isLength({ max: 2000 }).withMessage("specifications must not be more than 20 characters"),
                                body("image").optional().isURL().withMessage("product_image must be a valid URL"),
                                body("stock").notEmpty().withMessage("stock is required").isNumeric().withMessage("stock must be a number"),
                                body("isFeatured").notEmpty().withMessage("isFeatured is required").isBoolean().withMessage("isFeatured must be either true or false"),
                                
                                errorValidator];

/**
 * Validates if the productId is not null and is a numeric integer.
 * 
 * @type {Array} - The validation array.
 */

export const productIdValidator = [param("productId").notEmpty().withMessage("productId is required"), isNumericInt("productId"), errorValidator];

/**
 *  get all product validator
 */

export const listProductsValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("search_key").optional().isString().withMessage("search_key needs to be a string"),
    parseSkipLimit,
    errorValidator,
];