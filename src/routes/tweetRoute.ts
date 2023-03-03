import { deleteTweet, getTweet } from './../controllers/tweetController';
import express from "express";

const router = express.Router();


router
    .route("/:id")
    .get(getTweet)
    .delete(deleteTweet)

export default router;