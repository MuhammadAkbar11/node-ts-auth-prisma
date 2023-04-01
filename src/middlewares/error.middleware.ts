import chalk from "chalk";
import BaseError from "../helpers/error.helper";
import logger from "../configs/logger.config";
import { Request, NextFunction, Response } from "express";
import { HTTP_STATUS_CODE } from "../configs/vars.config";
import { isObjectEmpty, objHasKey, printDivider } from "../utils/utils";

function logError(err: any) {
  logger.error(chalk.red(`[SERVER] ERROR(${err?.statusCode}): ${err.message}`));
  let trace = "-";
  if (err.errors.stackTrace) {
    console.log();
    trace = `\n\n
  ${err.errors.stackTrace.join(`\n\n  `)}\n`;
  }

  console.log(
    chalk.red(`${printDivider()}

  Name              : ${err.name}
  Message:          : ${err.message}
  Operational Error : ${err?.errors?.isOperational ? "Yes" : "No"}
  Stack Trace       : ${trace}

${printDivider()}`)
  );

  // Usage:
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

  let responseData = {
    name,
    status,
    message,
  };

  if (objHasKey(errData, "stackTrace")) {
    delete errData.stackTrace;
  }

  if (!isObjectEmpty(errData)) {
    return res.status(status).json({ ...responseData, errors: errData });
  }

  res.status(status).json(responseData);
}
