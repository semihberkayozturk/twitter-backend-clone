import { logIn,signUp } from './../controllers/authController';
import { deleteMe, deleteUser, getUser,updateUser} from './../controllers/userController';
import express from "express";

const router = express.Router();

router.post("/login",logIn);
router.post("/signup",signUp);

router.delete("/settings/delete-me/",deleteMe);


router
    .route("/:username")
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)


export default router;