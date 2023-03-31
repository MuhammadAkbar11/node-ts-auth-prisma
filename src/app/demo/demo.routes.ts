import { Application } from "express";
import { CoreRouter } from "../../core/router.core";
import DemoController from "./demo.controller";

class DemoRouter extends CoreRouter {
  constructor() {
    super();
    this.init();
  }

  protected init() {
    const controller = new DemoController();
    this.router.get("/", controller.GET);
  }
}

export default DemoRouter;
