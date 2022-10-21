import Joi from "joi";

export const passwordFormInput = Joi.object({
  password: Joi.string().min(6).required(),
});


export const emailFormInput = Joi.object({
  email: Joi.string().email().required(),
});

