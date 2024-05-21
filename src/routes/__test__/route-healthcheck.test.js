import "dotenv/config";
import server from "supertest";
import { createRequest, HttpClient } from "@secure-access-control/client";
import { expressApp } from "../../server";
import { mysqlDisconnect } from "../../services/mysql-service";

afterAll(async () => {
  await mysqlDisconnect();
});

const SERVICE_ROUTE = "v1";

/**
 * To test health check routes
 */
describe("Health Check Route", () => {
  /**
   * Test to validate the health of the service
   * It should respond status code 200 and postgres and redis fields
   */
  test("GET v1/auth/health : To test health check", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/health", "get", HttpClient.SERVER);
    let response = await server(expressApp)
      .get("/" + request.url)
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
  });
});
