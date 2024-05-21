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

const SERVICE_ROUTE = "v1/cart";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's cart Route
 */
describe("User cart Route", () => {

  let cartId = null;
  
  /**
   * search cart by name
   * It should respond with success message
   */

  test("GET v1/cart : To search a cart by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].cart_id);
        expect(data[i].quantity);
      }
    });


  /**
   * search cart by name with pagination
   * It should respond with success message
   */

  test("GET v1/cart : To search a cart by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].cart_id);
        expect(data[i].quantity);
        
      }
    });
  
  /**
   * Test to create cart,
   * It should respond with success message
   */
  test("POST v1/cart : To create a cart", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        quantity: 2,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
   // expect(data.cart_id);
    expect(data.quantity);
    cartId = data.cart_id;
    
  });

  /**
   * Test to get cart list,
   * It should respond with success message
   */
  test("GET v1/cart : To get a cart", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+cartId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.cart_id);
    expect(data.quantity);
    cartId = data.cart_id;
  });

  /**
   * Test to update cart,
   * It should respond with success message
   */
  test("patch v1/cart : To update a cart", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+cartId, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        name: "abcd",
        quantity: 2,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.cart_id);
    expect(data.quantity);
    cartId = data.cart_id;
    
  });

  /**
   * Test to delete cart,
   * It should respond with success message
   */
  test("DELETE v1/cart : To delete a cart", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+cartId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.cart_id);
  });

});