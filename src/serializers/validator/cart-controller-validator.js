/**
 * @module cart-controller-validator
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
 * Validates if the cartId is not null
 * @type {Array} - The validation array.
 */

export const cartValidator = [body("cart_name").notEmpty().withMessage("cart_name is required").isLength({ max: 20 }).withMessage("cart_name must not be more than 20 characters"),
                                body("cart_description").notEmpty().withMessage("cart_description is required").isLength({ max: 100 }).withMessage("cart_description must not be more than 100 characters"),
                                body("cart_quantity").notEmpty().withMessage("cart_quantity is required").isNumeric().withMessage("cart_quantity must be a number"),
                                body("cart_image").optional().isURL().withMessage("cart_image must be a valid URL"),
                                errorValidator];

/**
 * Validates if the cartId is not null
 * @type {Array} - The validation array.
 */

export const cartIdValidator = [param("cartId").notEmpty().withMessage("cart id is required"), isNumericInt("cartId"), errorValidator];

/**
 * get all cart validator
 */

export const listCartsValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("sort").optional().isString().withMessage("sort needs to be a string"),
    query("cart_name").optional().isString().withMessage("cart_name needs to be a string"),
    query("cart_description").optional().isString().withMessage("cart_description needs to be a string"),
    query("cart_quantity").optional().isNumeric().withMessage("cart_quantity needs to be a number"),
    query("cart_image").optional().isURL().withMessage("cart_image needs to be a valid URL"),
    parseSkipLimit,
    errorValidator
];