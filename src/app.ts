import express from "express";
import userRoute from "./routes/userRoute";
import tweetRoute from "./routes/tweetRoute";
import AppError from "./utils/appError";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "../src/controllers/errorController";
import swaggerUi from "swagger-ui-express";
import YAML from "js-yaml";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
// Secure the HTTP headers with helmet
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  // Time window in milliseconds within which the maximum number of requests can be made.
  windowMs: 60 * 60 * 100, // 100(max) requests in 1 hour
  message: "Too many requests from this IP! Please try later!"
});

app.use("/api/v1", limiter);

app.use(express.json({
  limit: "10kb"
}));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// Swagger configuration
const swaggerDocument = YAML.load(fs.readFileSync(path.resolve(__dirname, "../src/doc/swagger.yaml"), "utf8"));
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this API!`, 404));
});

app.use(globalErrorHandler);

export default app;