import Express from "express";
import mysqlService, { mySQL } from "../services/mysql-service.js";
import redisService from "../services/redis-service.js";
import { metricsLogError, parseError } from "prom-nodejs-client";

/**
 * Controller to check the all the external services like Postgres / MongoDB / Redis is connected
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const healthCheckController = async (req, res) => {
  try {
    let mysqlResponse = await mySQL`SELECT NOW() as time`.execute(mysqlService);
    let redisResponse = await redisService.get("health-check");
    if (!redisResponse) await redisService.set("health-check", "Redis connection is working fine!");

    let response = {
      message: "service is running fine",
      data: {
        mysql: mysqlResponse.rows?.[0],
        redis: redisResponse,
      },
    };
    res.status(200).json(response);
  } catch (ex) {
    console.log("healthcheck-controller:", ex);
    console.log("healthCheckController: ", parseError(ex));
    metricsLogError("healthCheckController: ", ex);
    res.status(500).json({
      message: "Server health is unstable, redis / mongo / mysql not working",
    });
  }
};

export default healthCheckController;
