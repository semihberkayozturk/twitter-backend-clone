import { Request,Response,NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import {User} from "../types/user";
import UserModel from '../db/models/user';

export interface ReqWithUser extends Request {
    user: {
        id:number;
    };
};

interface GetUserRequest extends Request {
  params: {
    username: string;
  };
}

interface UpdateUserRequest extends Request {
  params: {
    username: string;
  };
  body: Partial<User>;
}

export const getUser = catchAsync(async (req: GetUserRequest, res: Response, next: NextFunction) => {
    const { username } = req.params;
    try {
      const user = await UserModel.findOne({ where: { username } });
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    try {
      const user = await UserModel.findOne({ where: { username } });
      if (!user) {
        return next(new AppError('User not found!', 404));
      }
      await user.destroy();
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
});

export const deleteMe = catchAsync(async(req:ReqWithUser,res:Response,next:NextFunction) => {
    const {id} = req.user;
    const user = await UserModel.findByPk(id);
    if(!user)return next(new AppError("User not found!",404));
    await user.destroy();
    res.status(204).json({
        status:"success",
        data:null
    });
});

export const updateUser = catchAsync(async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ where: { username } });
    if (!user) {
      return next(new AppError('User not found!', 404));
    }
    await user.update(req.body);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});
