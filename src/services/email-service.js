import axios from "axios";
import { parseError } from "prom-nodejs-client";

const EMAIL_SERVICE_BASE_URL = process.env.EMAIL_SERVICE_BASE_URL;
const EMAIL_SERVICE_AUTHORIZATION_TOKEN = process.env.EMAIL_SERVICE_AUTHORIZATION_TOKEN;

const SERVICE_ROUTES = {
  SEND_EMAIL: "/send",
};

const REQUEST_METHODS = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  delete: "delete",
};

/**
 * Function which is used to send request to EMAIL service
 * @param { string } url
 * @param { string } method
 * @param {*} data
 * @returns
 */
const emailServiceController = async (url, method, data) => {
  const request = {
    baseURL: EMAIL_SERVICE_BASE_URL,
    url: url,
    method: method,
    data: data,
    headers: {
      Authorization: EMAIL_SERVICE_AUTHORIZATION_TOKEN,
    },
  };
  let response = await axios(request);
  return response.data;
};

/**
 * Function which is used to send email
 * @param { string } type
 * @param { string[] } toAddresses
 * @param { string[] } ccAddresses
 * @param { string } subject
 * @param { object } body
 * @returns
 */
const send = async (type, toAddresses, ccAddresses, subject, body) => {
  try {
    let response = await emailServiceController(SERVICE_ROUTES.SEND_EMAIL, REQUEST_METHODS.POST, {
      to_addresses: toAddresses,
      cc_addresses: [],
      subject: null,
      body: body,
      type,
    });
    if (!response) console.log("sendEmail response: ", response);

    return response.data;
  } catch (ex) {
    console.log("email service, sendEmail", ex?.response?.data || parseError(ex));
    throw { statusCode: ex?.response?.status || 500, message: ex?.response?.data?.message || "email service: unable to get the data" };
  }
};
const emailService = {
  send,
};

export default emailService;
