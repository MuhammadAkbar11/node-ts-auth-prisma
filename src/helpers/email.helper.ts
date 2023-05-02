import nodemailer from "nodemailer";
import BaseError from "./error.helper";
import {
  createOAuthTransporter,
  createZohoMailTransporter,
} from "../configs/nodemailer.config";
import { DEVS_EMAIL, GMAIL, ZOHOMAIL } from "../configs/vars.config";
import logger from "../configs/logger.config";
import { BindAllMethods } from "../utils/decorators.utils";
import { packageJsonInfo } from "../utils/utils";

type TransporterTypes = "gmail-oauth" | "zohomail";

@BindAllMethods
class EmailSender {
  private transporter: TransporterTypes;

  constructor(transporter?: TransporterTypes) {
    this.transporter = transporter || ("gmail" as TransporterTypes);
  }

  async sendEmail(emailOptions: nodemailer.SendMailOptions): Promise<void> {
    try {
      let fromEmail = GMAIL;
      let emailTransporter = null;
      if (this.transporter === "zohomail") {
        fromEmail = ZOHOMAIL;
        emailTransporter = await createZohoMailTransporter();
      } else {
        emailTransporter = await createOAuthTransporter();
      }
      logger.info(
        `[HELPER] Sending email with ${fromEmail} email to ${emailOptions.to}`
      );
      emailOptions.from = fromEmail;
      if (emailTransporter) {
        return await emailTransporter.sendMail(emailOptions);
      }

      throw new BaseError(
        "MAIL_ERR",
        400,
        "Failed to send email bacause invalid transporter"
      );
    } catch (err: any) {
      const errors = new BaseError(
        err?.name || "MAIL_ERR",
        err.statusCode,
        err.message,
        {
          isOperational: true,
        }
      );
      throw errors;
    }
  }

  static async sendRefreshTokenErrorEmail(): Promise<void> {
    try {
      const emailTransporter = await createZohoMailTransporter();

      const appName = `"${packageJsonInfo().description}"`;

      // const emailContent = `Dear developers,<br><br>We are writing to inform you that the Google OAuth Refresh Token used for authentication in <strong>${appName}</strong> has expired or is invalid. This is preventing users from accessing certain features of the application, and we need your help to resolve the issue.<br><br>Please take the necessary steps to obtain a new Google OAuth Refresh Token and update <strong>${appName}</strong> as soon as possible to ensure that users can continue to use all of its features.<br><br>If you have any questions or need further assistance, please feel free to contact us.<br><br>Thank you,<br><br>The ${appName} Team`;

      const emailContent = `
      <html>
        <body>
          <p>Dear developer,</p>
          <p>We regret to inform you that the Google OAuth Refresh Token used for authentication in <strong><em>${appName}</em></strong> has expired or is invalid. This is preventing users from accessing certain features of the application.</p>
          <p>To resolve this issue, please take the following steps:</p>
          <ol>
            <li>Obtain a new Google OAuth Refresh Token.</li>
            <li>Update <strong><em>${appName}</em></strong> with the new Refresh Token.</li>
          </ol>
          <p>If you have any questions or need further assistance, please feel free to contact us.</p>
          <p>Thank you.</p> <br>
          <p>The <strong><em>${appName}</em></strong> Team</p>
        </body>
      </html>
      `;

      const emailOptions: nodemailer.SendMailOptions = {
        from: ZOHOMAIL,
        // to: DEVS_EMAIL,
        to: "bacef86170@ippals.com",
        subject: `URGENT: Google OAuth Refresh Token Expired/Invalid for ${appName}`,
        html: emailContent,
      };

      return await emailTransporter.sendMail(emailOptions);
    } catch (err: any) {
      const errors = new BaseError(
        err?.name || "MAIL_ERR",
        err.statusCode,
        err.message,
        {
          isOperational: true,
        }
      );
      throw errors;
    }
  }
}

export default EmailSender;
