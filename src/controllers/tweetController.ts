import catchAsync from "../utils/catchAsync";
import { Response,Request,NextFunction } from "express";
import client from "../db/config";
import AppError from "../utils/appError";
import { User} from "../types/user";
import redis from "redis";

let redisClient = redis.createClient({url:process.env.REDIS_URL})
redisClient.on("connect",() => console.log("Redis Connection Is Successful!"));
redisClient.on("err", (err:Error) => console.log("Redis Client Error:",err));
redisClient.connect();

export interface ReqWithBodyAndUser extends Request {
    user: User,
    body: {[key:string]:string | undefined}
};

export const getTweet = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    let tweetId = req.params.id;
    let cacheValue = await redisClient.get(`tweet:${tweetId}`);
    if(cacheValue){
        console.log("Serving from cache!");
        res.status(200).json({
            status:"success",
            data:JSON.parse(cacheValue)
        })
    }else{
        const query = {
            text:"SELECT * FROM tweets WHERE id = $1",
            values:[req.params.id]
        }
        const {rows} = await client.query(query);
        if(rows.length === 0){
            return next(new AppError("Tweet not found!",404));
        }
        const tweet = rows[0];
        //expiration olmuyor!
        await redisClient.set(`tweet:${tweetId}`, JSON.stringify(tweet));

        console.log("Caching the tweet!");
        res.status(200).json({
            status:"success",
            data:tweet
        })
    }
});

export const deleteTweet =  catchAsync(async (req:Request,res:Response,next:NextFunction) => {
    const resultQuery = await client.query(`SELECT * FROM tweets WHERE id = '${req.params.id}'`);
    if(resultQuery.rowCount === 0){
        return next(new AppError("Tweet was not found!",404));
    }
    await client.query(`DELETE FROM tweets WHERE id = '${req.params.id}'`);
    res.status(204).json({
        status:"success",
        data:null
    });
});

export const createTweet = catchAsync(async (req:ReqWithBodyAndUser,res:Response,next:NextFunction) => {
    if (!req.body.tweet || typeof req.body.tweet !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid request body!',
        });
      };
    //login,signup implemente ettikten sonra user_id nin karsisina req.user.id gelmeli
    const [{tweet},user_id] = [req.body,1];
    const query = {
        text:`INSERT INTO tweets(tweet,user_id) VALUES($1,$2) RETURNING *`,
        values: [tweet,user_id]
    };
    const {rows} = await client.query(query);

    res.status(201).json({
        status:"success",
        data: {
            tweet:rows[0]
        }
    });
});