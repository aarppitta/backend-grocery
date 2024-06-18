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

export const userValidator = [
body("name").notEmpty().withMessage("name is required").isLength({ max: 20 }).withMessage("name must not be more than 20 characters"),

body("display_name").notEmpty().withMessage("display_name is required").isLength({ max: 20 }).withMessage("display_name must not be more than 20 characters"),

body("email").notEmpty().withMessage("email is required").isEmail().withMessage("email must be a valid email"),

body("password").notEmpty().withMessage("password is required").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),

// body("gender").notEmpty().withMessage("Gender is required").isIn().withMessage("Invalid gender selection"),                              
                               
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