import client from "../db/db";
import { Request,Response,NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import app from "../app";

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = {
        text: 'SELECT * FROM Users WHERE username = $1',
        values: [req.params.nickname]
    };
    const {rows} = await client.query(query)
    if (rows.length === 0) {
        console.log("error")
        //return next(new AppError("User not found", 404));
    }
    const user = rows[0];
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    });
});