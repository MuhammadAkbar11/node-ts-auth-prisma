import { NextFunction, Request, Response } from "express";
import { CoreController } from "../../core/controller.core";
import { BindAllMethods } from "../../utils/decorators.utils";
import apiVersion from "../../utils/version.utils";

@BindAllMethods
class DemoController extends CoreController {
  constructor() {
    super();
  }

  public async GET(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        message:
          "Welcome to node rest auth built with express, typescript & pisma.io ",
        version: apiVersion(),
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }
}

export default DemoController;
