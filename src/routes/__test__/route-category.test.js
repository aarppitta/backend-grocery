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

const SERVICE_ROUTE = "v1/category";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's category Route
 */
describe("User category Route", () => {

  let categoryId = null;
  
  /**
   * search category by name
   * It should respond with success message
   */

  test("GET v1/category : To search a category by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].category_id);
        expect(data[i].name);
        expect(data[i].description);
        expect(data[i].image);
      }
    });
  
  /**
   * Test to create category,
   * It should respond with success message
   */
  test("POST v1/category : To create a category", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        name: "abcd",
        image: "https://fastly.picsum.photos/id/504/200/300.jpg?hmac=mycti8qYrnGcag5zUhsVOq7hQwb__R-Zf--aBJAH_ec",
        description: "test category description"
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
   // expect(data.category_id);
    expect(data.name);
    expect(data.description);
    expect(data.image);
    categoryId = data.category_id;
  });

  /**
   * Test to get category list,
   * It should respond with success message
   */
  test("GET v1/category : To get a category", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+ categoryId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.category_id);
    expect(data.name);
    expect(data.description);
    expect(data.image);
    categoryId = data.category_id;
  });

  /**
   * Test to update category,
   * It should respond with success message
   */
  test("patch v1/category : To update a category", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+10, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        name: "abcde",
        image: "https://fastly.picsum.photos/id/504/200/300.jpg?hmac=mycti8qYrnGcag5zUhsVOq7hQwb__R-Zf--aBJAH_ec",
        description: "test category description11"
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.name);
    expect(data.description);
    expect(data.image);
    categoryId = data.category_id;
  });

  /**
   * Test to delete category,
   * It should respond with success message
   */
  test("DELETE v1/category : To delete a category", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/" + categoryId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.category_id);
    categoryId = data.category_id;
  });

});