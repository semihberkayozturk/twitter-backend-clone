import { User } from "../types/user";
import UserModel from '../db/models/user';
import AppError from "../utils/appError";
import {setAsync, getAsync} from "../db/redisImpl";

//TODO: Replace them with OpenAPI models
//Redis implementation
export const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
      const user = await UserModel.findOne({ where: { username } });
      return user;
    } catch (error) {
      throw new AppError('Error retrieving user!', 500);
    }
};

export const deleteUserByUsername = async(username:string): Promise<void> => {
    try {
        const user = await UserModel.findOne({ where: { username } });
        if (!user) {
            throw new AppError('User not found!', 404);
        }
        await user.destroy();
    } catch (error) {
        throw new AppError('Error deleting user!', 500);
    }
};

//Partial makes all properties of an object optional
export const updateUserByUsername = async(username:string, updatedUser:Partial<User>): Promise<void> => {
    try {
        const user = await UserModel.findOne({ where: { username } });
        if (!user) {
            throw new AppError('User not found!', 404);
        }
        await user.update(updatedUser);
    } catch (error) {
        throw new AppError('Error updating user!', 500);
    }
};

export const createUser = async (user: User): Promise<User> => {
    try {
        const newUser = await UserModel.create(user);
        return newUser;
    } catch (error) {
        throw new AppError('Error creating user!', 500);
    }
};
