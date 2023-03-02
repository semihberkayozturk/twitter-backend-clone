import express from "express";
import userRoute from "./routes/userRoute";
import tweetRoute from "./routes/tweetRoute";
import AppError from "./utils/appError";

const app = express();

app.use("/tw/api/user",userRoute);
app.use("/tw/api/tweet",tweetRoute);

app.all("*",(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this API!`,404));
});

export default app;