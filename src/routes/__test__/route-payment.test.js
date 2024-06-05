import server from "supertest";
import { HttpClient, base64, createRequest } from "@secure-access-control/client";
import { expressApp } from "../../server";
import { mysqlDisconnect } from "../../services/mysql-service";
import getAccessToken from "./utils/get-access-token";
import "dotenv/config";
import axios from "axios";

afterAll(async () => {
  await mysqlDisconnect();
});

const SERVICE_ROUTE = "v1/user/address";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's payment Route
 */
describe("User payment Route", () => {

  let paymentId = null;
  
  /**
   * search payment by name
   * It should respond with success message
   */

  test("GET v1/payment : To search a payment by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].amount);
      }
    });


  /**
   * search payment by name with pagination
   * It should respond with success message
   */

  test("GET v1/payment : To search a payment by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].amount);
        
      }
    });
  
  /**
   * Test to create payment,
   * It should respond with success message
   */
  test("POST v1/payment : To create a payment", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        amount: 22,
        
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
    expect(data.amount);
    paymentId = data.payment_id;
  });

  /**
   * Test to get payment list,
   * It should respond with success message
   */
  test("GET v1/payment : To get a payment", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+paymentId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.amount);
    paymentId = data.payment_id;
  });

  /**
   * Test to update payment,
   * It should respond with success message
   */
  test("patch v1/payment : To update a payment", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+paymentId, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        amount: 55,

      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.amount);
    paymentId = data.payment_id;
  });

  /**
   * Test to delete payment,
   * It should respond with success message
   */
  test("DELETE v1/payment : To delete a address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+paymentId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.payment_id);
  });

});