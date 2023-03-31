import chalk from "chalk";
import BaseError from "../helpers/error.helper";
import logger from "../configs/logger.config";
import { Request, NextFunction, Response } from "express";
import { HTTP_STATUS_CODE } from "../configs/vars.config";

const errorText = chalk.hex("#DA1212");

function logError(err: any) {
  // logger.error(chalk.red(`[name] : ${err.name}`));
  logger.error(chalk.red(`[message] : ${err.message}`));
  logger.error(`${errorText("[stack] : ")} \n${errorText(err.stack)}`);
}

export function logErrorMiddleware(
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  logError(err);
  return next(err);
}

export function returnError404Middleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new BaseError("BAD_REQUEST", 404, "Page Not Found", {});
  next(BaseError.transformError(error));
}

export function returnErrorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const name = err?.name || "SERVER_ERROR";
  const status = err?.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER;
  const message = err?.message || "Internal Server Error";
  const errData = err?.errors || null;
  res.status(status).json({
    name,
    status,
    message,
    errors: errData,
  });
}
