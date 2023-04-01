import { PrismaClient } from "@prisma/client";
import { HTTP_STATUS_CODE } from "../configs/vars.config";
import BaseError from "../helpers/error.helper";
import { ErrorData } from "../utils/types/interfaces";
import prisma from "../database/prisma";
import { getErrorSnippets } from "../utils/utils";

export class CoreService {
  protected prisma: PrismaClient;
  protected methodStatus = HTTP_STATUS_CODE;
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

  protected throwError(error: any) {
    const name = error?.name || "EXCEPTION";
    const statusCode = error?.statusCode || this.methodStatus.INTERNAL_SERVER;
    const msg = error?.message || "Something went wrong on Service";
    throw this.error(name, statusCode, msg, {
      isOperational: error?.isOperational || false,
      stackTrace: getErrorSnippets(error),
    });
  }
}
