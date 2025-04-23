import { userModel } from "../models/User.mjs";
import {
  loginUserValidator,
  registerUserValidator,
  updateUserValidator,
} from "../validators/auth.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utilities/mailing.mjs";

export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerUserValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const existingUser = await userModel.findOne({
       email: value.email 
    });
    if (existingUser) return res.status(409).json("User already exists");

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
    });

    try {
      await sendEmail(
        newUser.email,
        "Welcome to Centsible",
        `Hello ${newUser.username}, thanks for signing up!`
      );
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.log("registration error", error)
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginUserValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const user = await userModel.findOne({ email: value.email });
    if (!user) return res.status(404).json("User does not exist");

    const isMatch = bcrypt.compareSync(value.password, user.password);
    if (!isMatch) return res.status(401).json("Invalid credentials");

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      id: user._id,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { error, value } = updateUserValidator.validate({
      ...req.body,
      profilePicture: req.file?.filename || "",
    });
    if (error) {
      return res.status(422).json({
        message: "Validation failed",
        details: error.details,
      });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.auth.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || "",
    });
  } catch (error) {
    next(error);
  }
};
