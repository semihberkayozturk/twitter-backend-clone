import { Request,Response,NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { getUserByUsername, deleteUserById, deleteUserByUsername, updateUserByUsername } from "../daos/userDao";
import { components } from "../types/openapi";

type User = components["schemas"]["User"];

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
    const user = await getUserByUsername(username);
    if (!user) {
      return next(new AppError('User not found!', 404));
    }
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    try {
      await deleteUserByUsername(username);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
    catch(error){
        next(error);
}});

export const deleteMe = catchAsync(async(req:ReqWithUser,res:Response,next:NextFunction) => {
    const { id } = req.user;
    try {
        await deleteUserById(id.toString());
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch(error){
        next(error);
    }
});

export const updateUser = catchAsync(async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
  const { username } = req.params;
  try {
    await updateUserByUsername(username, req.body);
    res.status(204).json({
      status: 'success',
      data: null,
    });
} catch (error) {
    next(error);
}});
