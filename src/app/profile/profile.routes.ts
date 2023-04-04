import express from "express";
import { BindAllMethods } from "../../utils/decorators.utils";
import { BaseRouter } from "../../core";
import ProfileController from "./profile.controller";
import { requiredUser } from "../../middlewares/auth.middleware";

@BindAllMethods
class ProfileRouter extends BaseRouter<ProfileController> {
  constructor(protected express: express.Application) {
    super(ProfileController, express);
  }

  protected routes(): void {
    this.router.get("/", requiredUser, this.controller.get);
  }
}

export default ProfileRouter;
