import { Router } from "express";
import { profilePicture } from "../middlewares/upload.mjs";
import { loginUser, registerUser, updateUser } from "../controllers/auth.mjs";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.mjs";

const userRouter = Router();

//register user
userRouter.post(
  "/user/register",
  profilePicture.single("profilePicture"),
  registerUser
);

//login user
userRouter.post("/user/login", loginUser);

//update user
userRouter.put(
  "/user/:id",
  isAuthenticated,
  isAuthorized, 
  updateUser
);

export default userRouter;
