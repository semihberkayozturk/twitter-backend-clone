import client from "../db/config";
import { Request,Response,NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = {
        text: 'SELECT * FROM Users WHERE username = $1',
        values: [req.params.username]
    };
    const {rows} = await client.query(query)
    if (rows.length === 0) {
        return next(new AppError("User not found", 404));
    }
    const user = rows[0];
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    });
});

export const deleteUser = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const selectQuery = {
        text:'SELECT * FROM users WHERE username = $1',
        values: [req.params.username]
    };
    const selectResult = await client.query(selectQuery);
    if(selectResult.rowCount === 0){
        return next(new AppError("User not found",404));
    }
    const deleteQuery = {
        text:'DELETE FROM users WHERE username = $1',
        values:[req.params.username]
    };
    await client.query(deleteQuery);
    res.status(204).json({
        status:"succes",
        data:null
    })
});