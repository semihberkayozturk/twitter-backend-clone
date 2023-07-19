import catchAsync from "../utils/catchAsync";
import { Response,Request,NextFunction } from "express";
import AppError from "../utils/appError";
import TweetModel from "../db/models/tweet";
import { components } from "../types/openapi";
import { getTweetById, deleteTweetById } from "../daos/tweetDao";

type User = components["schemas"]["User"];

export interface ReqWithBodyAndUser extends Request {
    user: User,
    body: {[key:string]:string | undefined}
};

export const getTweet = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const { id } = req.params;
    try {
        const tweet = await getTweetById(Number(id));
        if (!tweet) {
            return next(new AppError('Tweet not found!', 404));
        }
        res.status(200).json({
            status:"success",
            data:tweet
        });
    }
    catch(error){
        next(error);
    }
});

export const deleteTweet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await deleteTweetById(Number(id));
        res.status(204).json({
            status:"success",
            data:null
        });
    }
    catch(error){
        next(error);
    };
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
