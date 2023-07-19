import UserModel from '../db/models/user';
import AppError from "../utils/appError";
import { hgetAsync, hsetAsync } from "../db/redisImpl";
import { components } from "../types/openapi";

type User = components["schemas"]["User"];

export const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
        const cachedUser = await hgetAsync('users', username);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        const user = await UserModel.findOne({ where: { username } });

        if (!user) {
            throw new AppError('User not found!', 404);
        }

        await hsetAsync('users', username, JSON.stringify(user));
        return user;
    } catch (error) {
        throw new AppError('Error getting user!', 500);
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
    const user = await UserModel.findOne({ where: { username } });
    if (!user) {
        throw new AppError('User not found!', 404);
    }
    await user.update(updatedUser);

    await hsetAsync(username, JSON.stringify(user));
};

export const createUser = async (user: components["schemas"]["User"]): Promise<User> => {
    try {
        const newUser = await UserModel.create(user);
        return newUser;
    } catch (error) {
        throw new AppError('Error creating user!', 500);
    }
};
