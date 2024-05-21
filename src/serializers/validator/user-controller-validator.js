/**
 * @module user-controller-validator
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
 * Validates if the userId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const userValidator = [body("user_name").notEmpty().withMessage("user_name is required").isLength({ max: 20 }).withMessage("user_name must not be more than 20 characters"),
                                body("user_email").notEmpty().withMessage("user_email is required").isEmail().withMessage("user_email must be a valid email"),
                                body("user_password").notEmpty().withMessage("user_password is required").isLength({ min: 8 }).withMessage("user_password must be at least 8 characters"),
                                body("user_mobile").notEmpty().withMessage("user_mobile is required").isLength({ max: 15 }).withMessage("user_mobile must not be more than 15 characters"),
                                body("user_role").notEmpty().withMessage("user_role is required").isLength({ max: 10 }).withMessage("user_role must not be more than 10 characters"),
                                errorValidator];


/**
 * Validates if the userId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const userIdValidator = [param("userId").notEmpty().withMessage("user id is required"), isNumericInt("userId"), errorValidator];

/**
 * get all user validator
 */

export const listUsersValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("search_key").optional().isString().withMessage("search_key needs to be a string"),
    parseSkipLimit,
    errorValidator,
    ];