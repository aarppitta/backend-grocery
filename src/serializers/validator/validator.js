import { validationResult } from "express-validator";
import NumberHelper from "../../helpers/number-helper.js";

/**
 * Function which is used to validate for any error
 * @returns
 */
const errorValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Function / middleware to parse skip and limit
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const parseSkipLimit = (req, res, next) => {
  let { skip, limit } = req.query;
  if (!NumberHelper.isNumeric(skip || "")) skip = 0;
  if (!NumberHelper.isNumeric(limit || "")) limit = 20;
  req.query.skip = parseInt(skip);
  req.query.limit = parseInt(limit);
  next();
};

/**
 * Function / Middleware to parse query is_active
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const parseQueryIsActive = (req, res, next) => {
  if (req.query.is_active === "false") req.query.is_active = false;
  else if (req.query.is_active === "null" || req.query.is_active === "both") req.query.is_active = null;
  else req.query.is_active = true;
  next();
};

export default errorValidator;
