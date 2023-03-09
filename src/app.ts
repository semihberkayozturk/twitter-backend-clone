import express from "express";
import userRoute from "./routes/userRoute";
import tweetRoute from "./routes/tweetRoute";
import AppError from "./utils/appError";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "../src/controllers/errorController";

const app = express();
app.use(express.json());
//Secure the HTTP headers with helmet
app.use(helmet());

const limiter = rateLimit({
    max:100,
    //time window in milliseconds within which the maximum number of requests can be made.
    windowMs:60*60*100,//100(max) requests in 1 hour
    message:"Too many requests from this IP! Please try later!"
});

app.use("tw/api",limiter);

app.use(express.json({
    limit: "10kb"
}));

app.use("/tw/api/user",userRoute);
app.use("/tw/api/tweet",tweetRoute);

app.all("*",(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this API!`,404));
});

app.use(globalErrorHandler);

export default app;