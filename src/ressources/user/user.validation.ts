import Joi from "joi";

export const registrationForm = Joi.object({
  username: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginForm = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
