import { NextFunction } from 'express';
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";

//Creates JWT by taking id as parameter
const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET as string,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user,statusCode,res) => {
    const token = signToken(user.id)
    return token
};



export const signUp = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
});

export const logIn = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
});