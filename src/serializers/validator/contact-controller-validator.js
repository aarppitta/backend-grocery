/**
 * @module contact-controller-validator
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
 * Validates if the contactId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const contactValidator = [body("fname").notEmpty().withMessage("First name is required").isLength({ max: 20 }).withMessage("First name must not be more than 20 characters"),
body("lname").notEmpty().withMessage("Last name is required").isLength({ max: 20 }).withMessage("Last name must not be more than 20 characters"),
                                body("email").notEmpty().withMessage("email is required").isEmail().withMessage("email must be a valid email"),
                                body("message").notEmpty().withMessage("message is required").isLength({ max: 200 }).withMessage("message must not be more than 200 characters"),
                                errorValidator];

/**
 * Validates if the contactId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */

export const contactIdValidator = [param("contactId").notEmpty().withMessage(" contactId is required"), isNumericInt("contactId"), errorValidator];

/**
    *  get all contact validator
    */

export const listContactsValidator = [query("skip").optional().custom(parseSkipLimit).withMessage("skip must be a number"),
                                    query("limit").optional().custom(parseSkipLimit).withMessage("limit must be a number"),
                                    errorValidator];
