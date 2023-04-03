import { Application, Router, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorData } from "../utils/types/interfaces";
import { HTTP_STATUS_CODE } from "../configs/vars.config";
import BaseError from "../helpers/error.helper";
import prisma from "../database/prisma";
import { getErrorSnippets } from "../utils/utils";

export abstract class BaseRouter<T> {
  protected readonly router: Router;
  protected readonly controller: T;

  constructor(
    protected Controller: new () => T,
    private readonly app: Application
  ) {
    if (typeof Controller !== "function") {
      throw new Error("Controller must be a constructor function");
    }
    this.router = Router();
    this.controller = new Controller();
    this.routes();
    this.app.use("/", this.router);
  }

  protected abstract routes(): void;

  public getRouter(): Router {
    return this.router;
  }
}

// BaseController
export abstract class BaseController {
  protected readonly prisma: PrismaClient;
  protected readonly methodStatus = HTTP_STATUS_CODE;
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

export class BaseService {
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
