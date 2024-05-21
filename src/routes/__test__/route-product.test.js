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

const SERVICE_ROUTE = "v1/product";
let authToken = null;

beforeAll(async () => {
  authToken = await getAccessToken();
});

/**
 * Test user's product Route
 */
describe("User product Route", () => {

  let productId = null;
  
  /**
   * search product by name
   * It should respond with success message
   */

  test("GET v1/product : To search a product by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("product name")}`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].name);
        expect(data[i].price);
        expect(data[i].description);
        expect(data[i].specifications);
        expect(data[i].image);
        expect(data[i].stock);
        expect(data[i].isFeatured);
      
      }
    });


  /**
   * search product by name 
   * It should respond with success message
   */

  test("GET v1/product : To search a product by name", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + `?search_key=${base64.encode("product name")}&skip=0&limit=1`, "get", HttpClient.SERVER, authToken);
    const response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
      expect(response.statusCode).toBe(200);
      const data = response.body.data;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].name);
        expect(data[i].price);
        expect(data[i].description);
        expect(data[i].specifications);
        expect(data[i].image);
        expect(data[i].stock);
        expect(data[i].isFeatured);
        
      }
    });
  
  /**
   * Test to create product,
   * It should respond with success message
   */
  test("POST v1/product : To create a product", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE, "post", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({
        name: "product name",
        price: 100,
        description : "product description",
        specifications : "specifications of the prodcuct",
        image : "https://fastly.picsum.photos/id/504/200/300.jpg?hmac=mycti8qYrnGcag5zUhsVOq7hQwb__R-Zf--aBJAH_ec",
        stock : 10,
        isFeatured : false,
        
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(201);
    const data = response.body.data;
    if (data) {
      expect(data.name);
      expect(data.price);
      expect(data.description);
      expect(data.specifications);
      expect(data.image);
      expect(data.stock);
      expect(data.isFeatured);
      productId = data.product_id;
    }
  });

  /**
   * Test to get product list,
   * It should respond with success message
   */
  test("GET v1/product : To get a product", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+productId, "get", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.name);
    expect(data.price);
    expect(data.description);
    expect(data.specifications);
    expect(data.image);
    expect(data.stock);
    expect(data.isFeatured);
    productId = data.product_id;
  });

  /**
   * Test to update product,
   * It should respond with success message
   */
  test("patch v1/product : To update a product", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+2, "patch", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .patch("/" + request.url)
      .send({
        name: "product name1",
        price: 100,
        description : "product description1",
        specifications : "product specifications1",
        image : "https://fastly.picsum.photos/id/504/200/300.jpg?hmac=mycti8qYrnGcag5zUhsVOq7hQwb__R-Zf--aBJAH_ec",
        stock : 10,
        isFeatured : true,
      })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    expect(data.name);
    expect(data.price);
    expect(data.description);
    expect(data.specifications);
    expect(data.image);
    expect(data.stock);
    expect(data.isFeatured);
    productId = data.product_id;
  });

  /**
   * Test to delete product,
   * It should respond with success message
   */
  test("DELETE v1/product : To delete a product", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE+"/"+productId, "delete", HttpClient.SERVER, authToken);
    let response = await server(expressApp)
      .delete("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    const data = response.body.data;
    productId = data.product_id;
  });

});