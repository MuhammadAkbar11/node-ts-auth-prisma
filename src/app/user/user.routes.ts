import { CoreRouter } from "../../core/router.core";
import validateResource from "../../middlewares/validate.middleware";
import UserController from "./user.controller";
import { createUserSchema } from "./user.schema";

class UserRouter extends CoreRouter<UserController> {
  constructor() {
    super(UserController);
    this.init();
  }

  protected init() {
    // this.router.post(
    //   "/",
    //   validateResource(createUserSchema),
    //   this.controller.createUser
    // );
  }
}

export default UserRouter;
