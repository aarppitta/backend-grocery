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

const SERVICE_ROUTE = "v1/wishlist";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's address Route
 */
describe("User wishlist Route", () => {

  let addressId = null;
  
  /**
   * search address by name
   * It should respond with success message
   */

  test("GET v1/wishlist : To search a wishlist by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].wishlist_id);
      }
    });


  /**
   * search address by name with pagination
   * It should respond with success message
   */

  test("GET v1/wishlist : To search a wishlist by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].wishlist_id);
      }
    });
  
  /**
   * Test to create wishlist,
   * It should respond with success message
   */
  test("POST v1/wishlist : To create a wishlist", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        // add wishlist data
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
    wishlistId = data.wishlist_id;
  });

  /**
   * Test to get address list,
   * It should respond with success message
   */
  test("GET v1/wishlist : To get a wishlist", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+wishlistId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.wishlist_id);
    wishlistId = data.wishlist_id;
  });

  /**
   * Test to update wishlist,
   * It should respond with success message
   */
  test("patch v1/wishlist : To update a wishlist", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+wishlistId, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        address_type: "OFFICE",
        //write update data
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.address_id);
    wishlistId = data.wishlist_id;
  });

  /**
   * Test to delete wishlist,
   * It should respond with success message
   */
  test("DELETE v1/wishlist : To delete a wishlist", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+wishlistId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.wishlist_id);
  });

});