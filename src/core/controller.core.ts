import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
import { HTTP_STATUS_CODE } from "../configs/vars.config";
import BaseError from "../helpers/error.helper";
import { ErrorData } from "../utils/types/interfaces";
import prisma from "../database/prisma";

export class CoreController {
  public prisma: PrismaClient;
  public methodStatus = HTTP_STATUS_CODE;
  constructor() {
    this.prisma = prisma;
  }

  protected error(
    name: string | null,
    statusCode: number,
    message: string,
    errors: ErrorData = {
      isOperational: true,
    }
  ) {
    return new BaseError(name, statusCode, message, errors);
  }

  protected nextError(next: NextFunction, error: any) {
    next(BaseError.transformError(error));
  }
}
