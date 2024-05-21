/**
 * @module order-controller-validator
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
 * Validates if the orderId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const orderValidator = [body("order_date").notEmpty().withMessage("order_date is required").isISO8601().withMessage("order_date must be a valid date"),
                                body("order_status").notEmpty().withMessage("order_status is required").isLength({ max: 20 }).withMessage("order_status must not be more than 20 characters"),
                                body("order_total").notEmpty().withMessage("order_total is required").isNumeric().withMessage("order_total must be a number"),
                                body("order_payment_status").notEmpty().withMessage("order_payment_status is required").isLength({ max: 20 }).withMessage("order_payment_status must not be more than 20 characters"),
                                body("order_payment_method").notEmpty().withMessage("order_payment_method is required").isLength({ max: 20 }).withMessage("order_payment_method must not be more than 20 characters"),
                                body("order_payment_date").optional().isISO8601().withMessage("order_payment_date must be a valid date"),
                                body("order_delivery_date").optional().isISO8601().withMessage("order_delivery_date must be a valid date"),
                                body("order_delivery_status").notEmpty().withMessage("order_delivery_status is required").isLength({ max: 20 }).withMessage("order_delivery_status must not be more than 20 characters"),
                                body("order_delivery_address").notEmpty().withMessage("order_delivery_address is required").isLength({ max: 200 }).withMessage("order_delivery_address must not be more than 200 characters"),
                                errorValidator];


/**
 * Validates if the orderId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */
export const orderIdValidator = [param("orderId").notEmpty().withMessage("order id is required"), isNumericInt("orderId"), errorValidator];

/**
 *  get all order validator
 */

export const listOrdersValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("search_key").optional().isString().withMessage("search_key needs to be a string"),
    parseSkipLimit,
    errorValidator,
];