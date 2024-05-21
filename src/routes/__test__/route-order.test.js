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

const SERVICE_ROUTE = "v1/order";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's order Route
 */
describe("User order Route", () => {

  let orderId = null;
  
  /**
   * search order by name
   * It should respond with success message
   */

  test("GET v1/order : To search a order by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].totalPrice);
ß      }
    });


  /**
   * search order by name 
   * It should respond with success message
   */

  test("GET v1/order : To search a order by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].totalPrice);
      
      }
    });
  
  /**
   * Test to create order,
   * It should respond with success message
   */
  test("POST v1/order : To create a order", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        totalPrice: 100,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
    expect(data.totalPrice);
    orderId = data.order_id;
  });

  /**
   * Test to get order list,
   * It should respond with success message
   */
  test("GET v1/order : To get a order", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+orderId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.totalPrice);
    orderId = data.order_id;
  });

  /**
   * Test to update order,
   * It should respond with success message
   */
  test("patch v1/order : To update a order", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+orderId, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        totalPrice: 110,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.totalPrice);
    orderId = data.order_id;
  });

  /**
   * Test to delete order,
   * It should respond with success message
   */
  test("DELETE v1/order : To delete a order", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+orderId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.order_id);
  });

});