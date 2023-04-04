import express from "express";
import { BaseRouter } from "../../core";
import uploadSingleImage from "../../middlewares/upload.middleware";
import validateResource from "../../middlewares/validate.middleware";
import AuthController from "./auth.controller";
import { signInUserSchema, signUpUserSchema } from "./auth.schema";
import { BindAllMethods } from "../../utils/decorators.utils";
import { requiredUser } from "../../middlewares/auth.middleware";

@BindAllMethods
class AuthRouter extends BaseRouter<AuthController> {
  constructor(protected express: express.Application) {
    super(AuthController, express);
  }

  protected routes(): void {
    this.router.post(
      "/user/signup",
      uploadSingleImage("/users"),
      [validateResource(signUpUserSchema)],
      this.controller.postSignUpUser
    );
    this.router.post(
      "/user/signin",
      [validateResource(signInUserSchema)],
      this.controller.postSignInUser
    );
    this.router.get("/user/session", requiredUser, this.controller.getSession);
  }
}

export default AuthRouter;
