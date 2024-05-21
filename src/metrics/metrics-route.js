import express from "express";
import promMid from "prom-nodejs-client";

const metricsRoute = express();

metricsRoute.use(
  promMid({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.02, 0.05, 0.1, 0.5, 1, 10],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  })
);

export default metricsRoute;
