import Joi from "joi";

export const registerUserValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");

export const loginUserValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateUserValidator = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  email: Joi.string().email(),
  profilePicture: Joi.string().allow(""),
});
