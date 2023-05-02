import express from "express";

import { BaseRouter } from "../../core";
// import validateResource from "../../middlewares/validate.middleware";
import UserController from "./user.controller";
// import { createUserSchema } from "./user.schema";

class UserRouter extends BaseRouter<UserController> {
  constructor(protected express: express.Application) {
    super(UserController, express);
  }

  protected routes() {
    // this.router.post(
    //   "/",
    //   validateResource(createUserSchema),
    //   this.controller.createUser
    // );
  }
}

export default UserRouter;
