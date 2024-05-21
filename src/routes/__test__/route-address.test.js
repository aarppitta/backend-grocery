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
 * Test user's address Route
 */
describe("User Address Route", () => {

  let addressId = null;
  
  /**
   * search address by name
   * It should respond with success message
   */

  test("GET v1/user/address : To search a address by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].address_type);
        expect(data[i].address_line_1);
        expect(data[i].address_line_2);
        expect(data[i].city);
        expect(data[i].state);
        expect(data[i].country);
        expect(data[i].pincode);
        expect(data[i].mobile);
      }
    });


  /**
   * search address by name with pagination
   * It should respond with success message
   */

  test("GET v1/user/address : To search a address by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].address_type);
        expect(data[i].address_line_1);
        expect(data[i].address_line_2);
        expect(data[i].city);
        expect(data[i].state);
        expect(data[i].country);
        expect(data[i].pincode);
        expect(data[i].mobile);
      }
    });
  
  /**
   * Test to create address,
   * It should respond with success message
   */
  test("POST v1/user/address : To create a address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        address_type: "OFFICE",
        address_line_1: "test address description",
        address_line_2 : "test address",
        city : "test city",
        state : "test state",
        country : "test country",
        pincode : 382445,
        mobile : 987654321,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
    expect(data.address_type);
    expect(data.address_line_1);
    expect(data.address_line_2);
    expect(data.city);
    expect(data.state);
    expect(data.country);
    expect(data.pincode);
    expect(data.mobile);
    addressId = data.address_id;
  });

  /**
   * Test to get address list,
   * It should respond with success message
   */
  test("GET v1/user/address : To get a address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+addressId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.address_type);
    expect(data.address_line_1);
    expect(data.address_line_2);
    expect(data.city);
    expect(data.state);
    expect(data.country);
    expect(data.pincode);
    expect(data.mobile);
    addressId = data.address_id;
  });

  /**
   * Test to update address,
   * It should respond with success message
   */
  test("patch v1/user/address : To update a address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+addressId, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        address_type: "OFFICE",
        address_line_1: "test address description changes",
        address_line_2 : "test image",
        city : "test city",
        state : "test state",
        country : "test country",
        pincode : 382445,
        mobile : 7802887212,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.address_type);
    expect(data.address_line_1);
    expect(data.address_line_2);
    expect(data.city);
    expect(data.state);
    expect(data.country);
    expect(data.pincode);
    expect(data.mobile);
    addressId = data.address_id;
  });

  /**
   * Test to delete address,
   * It should respond with success message
   */
  test("DELETE v1/user/address : To delete a address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+addressId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.address_id);
  });

});