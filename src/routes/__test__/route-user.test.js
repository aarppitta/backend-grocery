import server from "supertest";
import { HttpClient, base64, createRequest } from "@secure-access-control/client";
import { expressApp } from "../../server";
import { mysqlDisconnect } from "../../services/mysql-service";
import getAccessToken from "./utils/get-access-token";
import "dotenv/config";


afterAll(async () => {
  await mysqlDisconnect();
});

const SERVICE_ROUTE = "v1/user";
let authToken = null;

beforeAll(async () => {
    authToken = await getAccessToken();
    });

/**
 * Test user's Route
 */

describe("User Route", () => {
    let userId = null;

    /**
     * search user by name
     * It should respond with success message
     */



        });

