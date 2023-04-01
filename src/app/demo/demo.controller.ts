import { NextFunction, Request, Response } from "express";
import { CoreController } from "../../core/controller.core";
import { BindAllMethods } from "../../utils/decorators.utils";
import apiVersion from "../../utils/version.utils";
import { prismaConnection } from "../../database/prisma";

@BindAllMethods
class DemoController extends CoreController {
  constructor() {
    super();
  }

  public async GET(_req: Request, res: Response, next: NextFunction) {
    try {
      const connect = await prismaConnection();
      res.status(200).json({
        message:
          "Welcome to node rest auth built with express, typescript & pisma.io ",
        version: apiVersion(),
        DBConnectionStatus: connect,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }
}

export default DemoController;
