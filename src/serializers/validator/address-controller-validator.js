/**
 * This module exports several validators for the address controller.
 * @module address-controller-validator
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
 * Validates if the addressId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */
export const addressValidator = [body("address_type").notEmpty().withMessage("address_type is required").isLength({ max: 10 }).withMessage("address_type must not be more than 10 characters"), 
                                body("address_line_1").notEmpty().withMessage("address_line_1 is required").isLength({ max: 200 }).withMessage("address_line_1 must not be more than 200 characters"),
                                body("address_line_2").optional().isLength({ max: 200 }).withMessage("address_line_2 must not be more than 200 characters"),
                                body("city").notEmpty().withMessage("city is required").isLength({ max: 100 }).withMessage("city must not be more than 100 characters"),
                                body("state").notEmpty().withMessage("state is required").isLength({ max: 100 }).withMessage("state must not be more than 100 characters"),
                                body("country").notEmpty().withMessage("country is required").isLength({ max: 100 }).withMessage("country must not be more than 100 characters"),
                                body("pincode").notEmpty().withMessage("pincode is required").isLength({ max: 6 }).withMessage("pincode must not be more than 6 characters"),
                                body("mobile").notEmpty().withMessage("mobile is required").isLength({ max: 15 }).withMessage("mobile must not be more than 15 characters"),
                                errorValidator];

/**
 * Validates if the addressId is not null and is a numeric integer.
 * @type {Array} - The validation array.
 */
export const addressIdValidator = [param("addressId").notEmpty().withMessage("address id is required"), isNumericInt("addressId"), errorValidator];

/**
 * get all address validator
 */
export const listAddressesValidator = [
  query("skip").optional().isNumeric().withMessage("skip needs to be a number"),
  query("limit").optional().isNumeric().withMessage("limit needs to be a number"),
  query("search_key").optional().isString().withMessage("search_key needs to be a string"),
  parseSkipLimit,
  errorValidator,
];