import { logIn,signUp } from './../controllers/authController';
import { deleteUser, getUser } from './../controllers/userController';
import express from "express";

const router = express.Router();

router.post("/login",logIn);
router.post("/signup",signUp);


router
    .route("/:username")
    .get(getUser)
    .delete(deleteUser)


export default router;