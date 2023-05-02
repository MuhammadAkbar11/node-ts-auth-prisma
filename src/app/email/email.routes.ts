import express from "express";
import { BindAllMethods } from "../../utils/decorators.utils";
import { BaseRouter } from "../../core";
import EmailController from "./email.controller";
import validateResource from "../../middlewares/validate.middleware";
import { emailSchema } from "./email.schema";

@BindAllMethods
class EmailRouter extends BaseRouter<EmailController> {
  constructor(protected express: express.Application) {
    super(EmailController, express);
  }

  protected routes(): void {
    this.router.post(
      "/zohomail",
      [validateResource(emailSchema)],
      this.controller.postZohoMail
    );

    this.router.post(
      "/gmail",
      [validateResource(emailSchema)],
      this.controller.postGmailMail
    );
  }
}

export default EmailRouter;
