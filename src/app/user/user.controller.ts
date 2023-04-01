import { NextFunction, Request, Response } from "express";
import { CoreController } from "../../core/controller.core";
import { BindAllMethods } from "../../utils/decorators.utils";
import { CreateUserInput } from "./user.schema";
import UserService from "./user.service";

@BindAllMethods
class UserController extends CoreController {
  private service = new UserService();
  constructor() {
    super();
  }

  public async createUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const user = await this.service.createUser({
      //   email: req.body.email,
      //   password: req.body.password,
      //   name: req.body.name,
      // });
      return res.status(201).json({
        message: "Registration successfully",
        // user: user,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }
}

export default UserController;
