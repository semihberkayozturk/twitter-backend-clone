import { deleteTweet, getTweet, createTweet } from './../controllers/tweetController';
import express from "express";

const router = express.Router();

router.post("/",createTweet);

router
    .route("/:id")
    .get(getTweet)
    .delete(deleteTweet)

export default router;