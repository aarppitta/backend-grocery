/**
 * Function which is used to convert string into camel case
 * @param { string } str
 * @returns
 */
const camelize = (str) => {
  str = str.toLowerCase().replace(/[ ]+(.)/g, (match, char) => {
    return " " + char.toUpperCase();
  });
  return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
};

const stringHelper = {
  camelize,
};

export default stringHelper;
