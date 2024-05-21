import "dotenv/config";
import server from "supertest";
import { HttpClient,  createRequest } from "@secure-access-control/client";
import { expressApp } from "../../../server";
import axios from "axios";

//const AUTH_BASE_URL = process.env.BASE_URL;
const AUTH_BASE_URL = "http://13.42.56.164:80/";
/**
 * Function which is used to get the access token
 * @returns
 */
const getAccessToken = async () => {
  let request = createRequest(AUTH_BASE_URL, "v1/oauth/token", "post", HttpClient.SERVER);
  request.data = { strategy: "password", email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD };
  request.headers["user-agent"] = "jest";
  let response = await axios(request);
  return response.data.token;
};

export default getAccessToken;