import Joi from "joi";

export const transactionValidator = Joi.object({
  title: Joi.string().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  date: Joi.date().optional(), 
  description: Joi.string().optional(),
});
