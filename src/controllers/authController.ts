import { NextFunction,Request,Response } from 'express';
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import client from '../db/config';
import { User } from '../types/user';
import { ReqWithBodyAndUser } from './tweetController';
import AppError from '../utils/appError';
import { promisify } from 'util';

export interface ReqWithUser extends Request {
    user: {
        id:number;
    };
};


//Creates JWT by taking id as parameter
const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET as string,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user,statusCode,res) => {
    const token = signToken(user.id)
    //send the JWT as cookie
    const cookieOptions = {
        expires:new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true
    }
    if(process.env.NODE_ENV=="production")cookieOptions.secure = true;
    res.cookie("jwt",token,cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status:"success",
        token,
        data: {
            user
        }
    });
};

export const signUp = catchAsync(async(req:ReqWithBodyAndUser,res:Response,next:NextFunction) => {
    const createUserQuery = {
        text:`INSERT INTO users(username,password,bio,avatar,phone,email) VALUES($1,$2,$3,$4,$5,$6)`,
        values: [req.body.username,req.body.password,req.body.bio,req.body.avatar,req.body.phone,req.body.email]
    };
    await client.query<User>(createUserQuery);
    const {rows} = await client.query(`SELECT * FROM users WHERE username = '${req.body.username}'`);
    createSendToken(rows[0],201,res);
});

export const logIn = catchAsync(async(req:ReqWithBodyAndUser,res:Response,next:NextFunction) => {
    const {email,password} = req.body;
    if(!email || !password){
        return next(new AppError("You need to provide an email and a password",401));
    }
    const {rows} = await client.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);
    if(rows.length === 0 || rows[0].password != password){
        return next(new AppError("Incorrect email or password",401));
    }
    createSendToken(rows[0],200,res);
});

export const protect = catchAsync(async(req:ReqWithUser,res:Response,next:NextFunction) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    };
    if(!token){
        return next(new AppError("You're not logged in! Please log in and try again.",401));
    };
    //Verifying the JWT
    const verifyToken = promisify(jwt.verify) as (
        token:string,
        secretOrPublicKey:jwt.Secret,
    ) => Promise<unknown>;

    const decoded = await verifyToken(token,process.env.JWT_SECRET as string) as {id:string};
    const {rows} = await client.query(`SELECT * FROM users WHERE id = '${decoded.id}'`)
    const freshUser = rows[0].id;
    if(!freshUser){
        return next(new AppError("The user belonging to this token does no longer exist",401));
    };
    req.user = freshUser;
    next();
});

export const restrictTo = (...roles) => {
    return (req:ReqWithUser,res:Response,next:NextFunction) => {
        if(!roles.includes(req.user.id)){
            return next(new AppError("You do not have permission to perform this action",403));
        };
        next();
    };
};

export const forgotPassword = catchAsync(async(req:ReqWithUser,res:Response,next:NextFunction) => {
    const {email} = req.body;
    const {rows} = await client.query(`SELECT * FROM users WHERE email = '${email}'`);
    const user = rows[0];
    if(!user){
        return next(new AppError("There is no user with this email address",404));
    };
});