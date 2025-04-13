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
    const { error, value } = registerUserValidator.validate({
      ...req.body,
      profilePicture: req.file?.filename,
    });
    if (error) return res.status(422).json(error);

    const existingUser = await userModel.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });
    if (existingUser) return res.status(409).json("User already exists");

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
    });

    await sendEmail(
      newUser.email,
      "Welcome to Centsible",
      `Hello ${newUser.username}, thanks for signing up!`
    );

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
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

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
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
    const { error, value } = updateUserValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
