import { getUser } from './../controllers/userController';
import express from "express";

const router = express.Router();


router
    .route("/:username")
    .get(getUser)