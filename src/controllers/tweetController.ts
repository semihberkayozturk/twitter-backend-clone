import catchAsync from "../utils/catchAsync";
import { Response,Request,NextFunction } from "express";
import client from "../db/config";
import AppError from "../utils/appError";

export const getTweet = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const query = {
        text:"SELECT * FROM tweets WHERE id = $1",
        values:[req.params.id]
    };
    const {rows} = await client.query(query);
    if(rows.length === 0){
        return next(new AppError("Tweet not found!",404));
    }
    const tweet = rows[0];
    res.status(200).json({
        status:"success",
        data:tweet
    })
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