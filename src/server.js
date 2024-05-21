import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import { accessControlManager } from "@secure-access-control/server";
import metricsRoute from "./metrics/metrics-route.js";
import mysqlService from "./services/mysql-service.js";
import healthCheckController from "./controllers/healthcheck-controller.js";

const app = express();
app.use(cors());
app.use(express.json());

const SERVICE_BASE_URL = "/v1";

/**
 * Metrics route for Prometheus
 */
app.use(metricsRoute);

/**
 * Route to get service health information
 * This route should be loaded before loading the accessControlManager.client
 */
app.get(SERVICE_BASE_URL + "/health", healthCheckController);

/**
 * All route in the system should be after accessControlManager.client
 */
//app.use(accessControlManager.client);

/**
 * Load all auth routes
 */
app.use(SERVICE_BASE_URL,accessControlManager.auth, routes);

/**
 * Route to handle the all other routes which are not part of the oauth and response error message
 */
app.use("*", (req, res) => {
  res.status(403).json({
    statusCode: 403,
    error: "Forbidden",
    message: "Service is unavailable",
  });
});

if (process.env.NODE_ENV !== "test")
  app.listen(process.env.APP_PORT, process.env.APP_HOST, (err) => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT}`);
  });

export const expressApp = app;
