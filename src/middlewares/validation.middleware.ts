import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

export function validationFormMiddleware(schema: Joi.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const options: Joi.AsyncValidationOptions = {
      abortEarly: true,
      allowUnknown: false,
      stripUnknown: true,
    };

    try {
      const cleanValue = await schema.validateAsync(req.body, options);
      req.body = cleanValue;
      next();
    } catch (e: any) {
      const errors: string[] = [];
      e.details.forEach((error: Joi.ValidationError) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors: errors });
    }
  };
}
