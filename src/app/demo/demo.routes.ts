import { CoreRouter } from "../../core/router.core";
import DemoController from "./demo.controller";

class DemoRouter extends CoreRouter<DemoController> {
  constructor() {
    super(DemoController);
    this.init();
  }

  protected init() {
    this.router.get("/", this.controller.GET);
  }
}

export default DemoRouter;
