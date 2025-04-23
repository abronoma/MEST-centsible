import Joi from "joi";

export const transactionValidator = Joi.object({
  description: Joi.string().optional(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  date: Joi.date().optional(), 
  
});
