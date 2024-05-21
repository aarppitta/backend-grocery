/**
 * @module wishlist-controller-validator
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
 * Validates if the wishlistId is not null
 * @type {Array} - The validation array.
 */

export const wishlistValidator = [body("wishlist_name").notEmpty().withMessage("wishlist_name is required").isLength({ max: 20 }).withMessage("wishlist_name must not be more than 20 characters"),
                                body("wishlist_description").notEmpty().withMessage("wishlist_description is required").isLength({ max: 100 }).withMessage("wishlist_description must not be more than 100 characters"),
                                body("wishlist_image").optional().isURL().withMessage("wishlist_image must be a valid URL"),
                                errorValidator];


/**
 * Validates if the wishlistId is not null
 * @type {Array} - The validation array.
 */

export const wishlistIdValidator = [param("wishlistId").notEmpty().withMessage("wishlist id is required"), isNumericInt("wishlistId"), errorValidator];

/**
 * get all wishlist validator
 */

export const listWishlistsValidator = [
    query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
    query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
    query("sort").optional().isString().withMessage("sort needs to be a string"),
    errorValidator
];