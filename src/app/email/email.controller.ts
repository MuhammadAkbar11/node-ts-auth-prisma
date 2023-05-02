import { NextFunction, Request, Response } from "express";
import { BindAllMethods } from "../../utils/decorators.utils";
import { BaseController } from "../../core";
import type { EmailPayload } from "./email.schema";
import EmailSender from "../../helpers/email.helper";

@BindAllMethods
class EmailController extends BaseController {
  constructor() {
    super();
  }

  public async postZohoMail(
    req: Request<{}, {}, EmailPayload["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { to, subject, text, html } = req.body;

      const emailSender = new EmailSender("zohomail");

      const email = await emailSender.sendEmail({
        to: to,
        subject: subject,
        text: text,
        html: html,
      });

      res.status(200).json({
        message: "Success sending email using zohomail transporter",
        email,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }

  public async postGmailMail(
    req: Request<{}, {}, EmailPayload["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { to, subject, text, html } = req.body;

      const emailSender = new EmailSender("gmail-oauth");

      const email = await emailSender.sendEmail({
        to: to,
        subject: subject,
        text: text,
        html: html,
      });

      res.status(200).json({
        message: "Success sending email using gmail transporter",
        email,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }
}

export default EmailController;
