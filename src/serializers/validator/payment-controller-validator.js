/**
 * @module payment-controller-validator
 */

import { body, param, query } from "express-validator";
import errorValidator,{ parseSkipLimit } from "./validator.js";

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
 * Validates if the paymentId is not null
 * @type {Array} - The validation array.
 */

export const paymentValidator = [body("payment_method").notEmpty().withMessage("payment_method is required").isLength({ max: 20 }).withMessage("payment_method must not be more than 20 characters"),
                                body("payment_status").notEmpty().withMessage("payment_status is required").isLength({ max: 20 }).withMessage("payment_status must not be more than 20 characters"),
                                body("payment_amount").notEmpty().withMessage("payment_amount is required").isNumeric().withMessage("payment_amount must be a number"),
                                body("payment_date").notEmpty().withMessage("payment_date is required").isDate().withMessage("payment_date must be a date"),
                                body("payment_time").notEmpty().withMessage("payment_time is required").isString().withMessage("payment_time must be a string"),
                                body("payment_description").optional().isString().withMessage("payment_description must be a string"),
                                errorValidator];


/**
 * Validates if the paymentId is not null
 * @type {Array} - The validation array.
 */

export const paymentIdValidator = [param("paymentId").notEmpty().withMessage("payment id is required"), isNumericInt("paymentId"), errorValidator];

/**
 * get all payment validator
 */

export const listPaymentsValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("sort").optional().isString().withMessage("sort needs to be a string"),
    query("payment_method").optional().isString().withMessage("payment_method needs to be a string"),
    query("payment_status").optional().isString().withMessage("payment_status needs to be a string"),
    query("payment_amount").optional().isNumeric().withMessage("payment_amount needs to be a number"),
    query("payment_date").optional().isDate().withMessage("payment_date needs to be a date"),
    query("payment_time").optional().isString().withMessage("payment_time needs to be a string"),
    query("payment_description").optional().isString().withMessage("payment_description needs to be a string"),
    parseSkipLimit
];