import { NextFunction,Request,Response } from 'express';
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { ReqWithBodyAndUser } from './tweetController';
import AppError from '../utils/appError';
import { promisify } from 'util';
import UserModel from '../db/models/user';

export interface ReqWithUser extends Request {
    user: {
        id:number;
    };
};


const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET as string,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user,statusCode:Number,res) => {
    const token = signToken(user.id)
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

export const signUp = catchAsync(async(req:ReqWithBodyAndUser,res:Response,next:NextFunction) => {{
    const {username, password, bio, avatar, phone, email} = req.body;
    try {
        const createdUser = UserModel.create({
            username,
            password,
            bio,
            avatar,
            phone,
            email
        });
        const user = await UserModel.findOne({where: {username}});
        createSendToken(user,201,res);
    }
    catch(err) {
        return next(new AppError("Error creating user",500));
    }
}});

export const logIn = catchAsync(async(req:ReqWithBodyAndUser,res:Response,next:NextFunction) => {
    const {email,password} = req.body;
    if(!email || !password){
        return next(new AppError("You need to provide an email and a password",401));
    }
    const user = await UserModel.findOne({ where: { email } });

    if(!user || user.password != password){
        return next(new AppError("Incorrect email or password",401));
    }
    createSendToken(user,200,res);
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
    const freshUser = await UserModel.findOne({where: {id: decoded.id}});
    if(!freshUser){
        return next(new AppError("The user belonging to this token no longer exists",401));
    }
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
    const user = await UserModel.findOne({where: {email}});
    if(!user){
        return next(new AppError("There is no user with that email address",404));
    }
    //TODO: Generate random reset token, send email to user
});