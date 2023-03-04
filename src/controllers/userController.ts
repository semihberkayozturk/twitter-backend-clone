import client from "../db/config";
import { Request,Response,NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import {User} from "../types/user";

export interface ReqWithUser extends Request {
    user: {
        id:number;
    };
};

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = {
        text: 'SELECT * FROM Users WHERE username = $1',
        values: [req.params.username]
    };
    const {rows} = await client.query<User>(query)
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
    const selectResult = await client.query<User>(`SELECT * FROM users WHERE username = '${req.params.username}'`);
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

//It will work after implementing login and signup functions
export const deleteMe = catchAsync(async(req:ReqWithUser,res:Response,next:NextFunction) => {
    const {id} = req.user;
    await client.query<User>(`DELETE FROM users WHERE id = '${id}'`)
    res.status(204).json({
        status:"success",
        data:null
    })
});

//UPDATE ME?
export const updateUser = catchAsync(async(req:ReqWithUser,res:Response,next:NextFunction) => {
    const findUser = await client.query(`SELECT * FROM users WHERE username = '${req.params.username}'`);
    if(findUser.rowCount === 0)return next(new AppError("User not found!",404));

    const fields = Object.keys(req.body);
    const values = fields.map((field) => req.body[field]);
    const updates = fields.map((field,index) => `${field} = $${index+1}`).join(', ');

    const query = {
        text:`UPDATE users SET ${updates} WHERE username = $${fields.length+1}`,
        values:[...values,req.params.username]
    };
    await client.query(query);
    res.status(204).json({
        status:"success",
        data:null
    });
});