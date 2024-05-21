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

const SERVICE_ROUTE = "v1/contact";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's contact Route
 */
describe("User contact Route", () => {

  let contactId = null;
  
  /**
   * search contact by name
   * It should respond with success message
   */

  test("GET v1/contact : To search a contact by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].fname);
        expect(data[i].lname);
        expect(data[i].email);
        expect(data[i].message);
ß      }
    });


  /**
   * search contact by name 
   * It should respond with success message
   */

  test("GET v1/contact : To search a contact by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("abcd")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].fname);
        expect(data[i].lname);
        expect(data[i].email);
        expect(data[i].message);
      }
    });
  
  /**
   * Test to create contact,
   * It should respond with success message
   */
  test("POST v1/contact : To create a contact", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        fname: "contact fname",
        lname: "contact lname",
        email : "contact@gmail.com",
        message : "hello contact",
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
    expect(data.fname);
    expect(data.lname);
    expect(data.email);
    expect(data.message);
    contactId = data.contact_id;
  });

  /**
   * Test to get contact list,
   * It should respond with success message
   */
  test("GET v1/contact : To get a contact", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+contactId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.fname);
    expect(data.lname);
    expect(data.email);
    expect(data.message);
    contactId = data.contact_id;
  });

  /**
   * Test to update contact,
   * It should respond with success message
   */
  test("patch v1/contact : To update a contact", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+contactId, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        fname: "contact fname1",
        lname: "contact lname1",
        email : "contact1@gmail.com",
        message : "hello contact1",
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.fname);
    expect(data.lname);
    expect(data.email);
    expect(data.message);
    contactId = data.contact_id;
  });

  /**
   * Test to delete contact,
   * It should respond with success message
   */
  test("DELETE v1/contact : To delete a contact", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+contactId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.contact_id);
  });

});