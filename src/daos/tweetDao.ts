import TweetModel from "../db/models/tweet";
import AppError from "../utils/appError";
import {getAsync, setAsync} from "../db/redisImpl";

export const getTweetById = async (tweetId: number)  => {
    try {
        const cachedTweet = await getAsync(`tweet:${tweetId}`);
        if (cachedTweet) {
            console.log("Serving from cache!");
            return JSON.parse(cachedTweet);
        }

        const tweet = await TweetModel.findByPk(tweetId);
        if (!tweet) {
            throw new AppError('Tweet not found!', 404);
        }
        await setAsync(`tweet:${tweetId}`, JSON.stringify(tweet));
        return tweet;
    } catch (err) {
        throw new AppError('Error retrieving tweet!', 500);
    }
};

export const deleteTweetById = async (tweetId: number) => {
    try {
        const tweet = await TweetModel.findByPk(tweetId);
        if (!tweet) {
            throw new AppError('Tweet not found!', 404);
        }
        await tweet.destroy();
    } catch (err) {
        throw new AppError('Error deleting tweet!', 500);
    }
};

export const updateTweetById = async (tweetId: number, updatedTweet: Partial<TweetModel>) => {
    try {
        const tweet = await TweetModel.findByPk(tweetId);
        if (!tweet) {
            throw new AppError('Tweet not found!', 404);
        }
        await tweet.update(updatedTweet);
    } catch (err) {
        throw new AppError('Error updating tweet!', 500);
    }
};

export const getTweetsByUserId = async (userId: number) => {
    try {
        const tweets = await TweetModel.findAll({ where: { userId } });
        return tweets;
    } catch (err) {
        throw new AppError('Error retrieving tweets!', 500);
    }
};

export const createTweet = async (tweet: string, userId:number) => {
    try {
        const newTweet = await TweetModel.create({ tweet, user_id: userId });
        return newTweet;
    } catch (err) {
        throw new AppError('Error creating tweet!', 500);
    }
};