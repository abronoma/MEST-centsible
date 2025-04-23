import { Router } from "express";
import { profilePicture } from "../middlewares/upload.mjs";
import { loginUser, registerUser, updateUser, getAuthenticatedUser } from "../controllers/auth.mjs";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.mjs";

const userRouter = Router();

//register user
userRouter.post(
  "/user/register",
  registerUser
);
//login user
userRouter.post("/user/login", loginUser);

//update user
userRouter.put(
  "/user/:id",
  profilePicture.single("profilePicture"),
  isAuthenticated,
  isAuthorized, 
  updateUser
);


userRouter.get('/user/me', isAuthenticated, getAuthenticatedUser )

export default userRouter;
