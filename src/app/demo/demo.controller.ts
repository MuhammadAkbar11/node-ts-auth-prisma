import { Request, Response } from "express";
import { CoreController } from "../../core/controller.core";
import { BindAllMethods } from "../../utils/utils";

@BindAllMethods
class DemoController extends CoreController {
  constructor() {
    super();
  }

  public async GET(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "demo page" });
    } catch (error) {
      res.status(500).json({
        message: "Something Went wrong",
      });
    }
  }
}

export default DemoController;
