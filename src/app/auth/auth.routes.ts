import { CoreRouter } from "../../core/router.core";
import uploadSingleImage from "../../middlewares/upload.middleware";
import validateResource from "../../middlewares/validate.middleware";
import { createUserSchema } from "../user/user.schema";
import AuthController from "./auth.controller";

class AuthRouter extends CoreRouter<AuthController> {
  constructor() {
    super(AuthController);
    this.init();
  }

  protected init() {
    this.router.post(
      "/user/signup",
      uploadSingleImage("/users"),
      [validateResource(createUserSchema)],
      this.controller.signupUser
    );
  }
}

export default AuthRouter;
