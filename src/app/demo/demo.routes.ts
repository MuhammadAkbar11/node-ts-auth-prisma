import express from "express";
import { BindAllMethods } from "../../utils/decorators.utils";
import DemoController from "./demo.controller";
import { BaseRouter } from "../../core";

@BindAllMethods
class DemoRouter extends BaseRouter<DemoController> {
  constructor(protected express: express.Application) {
    super(DemoController, express);
  }

  protected routes(): void {
    this.router.get("/", this.controller.get);
  }
}

export default DemoRouter;
