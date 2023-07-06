import catchAsync from "../utils/catchAsync";
import { Response,Request,NextFunction } from "express";
import AppError from "../utils/appError";
import { User} from "../types/user";
import * as redis from "redis";
import TweetModel from "../db/models/tweet";

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
        try {
            const tweet = await TweetModel.findByPk(tweetId);
            if (!tweet) {
              return next(new AppError('Tweet not found!', 404));
            }
            await redisClient.set(`tweet:${tweetId}`, JSON.stringify(tweet));
      
            res.status(200).json({
              status: 'success',
              data: tweet,
            });
          }
        catch (error) {
        next(error);
        }
    }
});

export const deleteTweet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const tweet = await TweetModel.findByPk(id);
      if (!tweet) {
        return next(new AppError('Tweet was not found!', 404));
      }
      await tweet.destroy();
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
});

//should implement some functions to protectin etc. setEntryUserId etc.
export const createTweet = catchAsync(async (req:ReqWithBodyAndUser,res:Response,next:NextFunction) => {
    if (!req.body.tweet || typeof req.body.tweet !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid request body!',
        });
      };
    const [{tweet},user_id] = [req.body,req.user.id];
    try {
        const newTweet = await TweetModel.create({tweet,user_id});
        res.status(201).json({
            status:"success",
            data:newTweet
        });
    }
    catch(error){
        next(error);
    }
});
