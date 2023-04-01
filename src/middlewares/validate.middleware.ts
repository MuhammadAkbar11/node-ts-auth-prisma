import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import BaseError from "../helpers/error.helper";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      const error = new BaseError("VALIDATION_ERR", 422, "Validation Error", {
        isOperational: true,
        validation: e.errors,
      });
      return next(BaseError.transformError(error));
    }
  };

export default validateResource;
