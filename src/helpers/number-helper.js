/**
 * Function which is used to generate a random number of length `limit`
 * @param { number } limit
 * @returns
 */
const randomNumber = (limit) => {
  return Math.floor(Math.random() * limit + 1);
};

/**
 * Function which is used to round the given value
 * @param { number } value
 * @param { number } decimals
 * @returns
 */
const round = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

/**
 * Function which is used to check the given input is a number or not
 * @param { string } value
 * @returns
 */
const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

const NumberHelper = {
  round,
  isNumeric,
  randomNumber
};

export default NumberHelper;
