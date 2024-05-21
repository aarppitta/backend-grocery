import { base64 } from "@secure-access-control/server";

/**
 * Decodes a base64 string and parses it as JSON.
 * @param {string} string - The base64 string to decode and parse.
 * @returns {Object|null} The parsed JSON object, or null if the input string is invalid.
 */
const base64ToJson = (string) => {
  if (!string) return null;
  try {
    const decoded = base64.decode(string);
    return JSON.parse(decoded) || null;
  } catch (ex) {
    return null;
  }
};

/**
 * Function which is used to convert the json into base64 string
 * @param { JSON } json
 * @returns
 */
const jsonToBase64 = (json) => {
  return base64.encode(JSON.stringify(json));
};

/**
 * Decode base64 without throwing error
 * @param { string } string
 * @returns
 */
const decode = (string) => {
  if (!string) return null;
  try {
    return base64.decode(string);
  } catch (ex) {
    return null;
  }
};

/**
 * Helper functions for base64
 */
const base64Helper = {
  decode,
  base64ToJson,
  jsonToBase64,
};

export default base64Helper;