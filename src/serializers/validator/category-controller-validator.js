/** 
* @module category-controller-validator
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
 * Validates if the categoryId is not null
 * @type {Array} - The validation array.
 */

export const categoryValidator = [body("name").notEmpty().withMessage("name is required").isLength({ max: 20 }).withMessage("category_name must not be more than 20 characters"),
                                body("description").notEmpty().withMessage("description is required").isLength({ max: 100 }).withMessage("category_description must not be more than 100 characters"),
                                body("image").optional().isURL().withMessage("image must be a valid URL"),
                                errorValidator];


/**
 * Validates if the categoryId is not null
 * @type {Array} - The validation array.
 */

export const categoryIdValidator = [param("categoryId").notEmpty().withMessage("categoryId is required"), isNumericInt("categoryId"), errorValidator];

/**
 * get all category validator
 */

export const listCategoriesValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    errorValidator
];