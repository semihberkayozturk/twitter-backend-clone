import express from "express";
import userRoute from "./routes/userRoute";
import tweetRoute from "./routes/tweetRoute";
import AppError from "./utils/appError";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
//Secure the HTTP headers with helmet
app.use(helmet());

const limiter = rateLimit({
    //Max request that can be made
    max:100,
    //time window in milliseconds within which the maximum number of requests can be made.
    windowMs:60*60*100,//1 hour
    message:"Too many requests from this IP! Please try later!"
});

app.use("tw/api",limiter);

app.use("/tw/api/user",userRoute);
app.use("/tw/api/tweet",tweetRoute);

app.all("*",(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this API!`,404));
});

export default app;