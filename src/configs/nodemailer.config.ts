import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  GMAIL,
  OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET,
  OAUTH_PLAYGROUND,
  OAUTH_REFRESH_TOKEN,
  ZOHOMAIL,
  ZOHOMAIL_PW,
} from "./vars.config";
import BaseError from "../helpers/error.helper";
import logger from "./logger.config";

const OAuth2 = google.auth.OAuth2;

export const createOAuthTransporter =
  async (): Promise<nodemailer.Transporter> => {
    try {
      const oauth2Client = new OAuth2(
        OAUTH_CLIENTID,
        OAUTH_CLIENT_SECRET,
        OAUTH_PLAYGROUND
      );

      oauth2Client.setCredentials({
        refresh_token: OAUTH_REFRESH_TOKEN,
      });

      const accessToken = await new Promise<string>((resolve, reject) => {
        return oauth2Client.getAccessToken((err: any, token) => {
          if (err) {
            const errors = new BaseError(
              "Error OAuth2",
              err.response.status,
              err.response.data?.error_description ||
                "Failed to create access token :("
            );

            reject(errors);
          }
          resolve(token as string);
        });
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: GMAIL,
          accessToken,
          clientId: OAUTH_CLIENTID,
          clientSecret: OAUTH_CLIENT_SECRET,
          refreshToken: OAUTH_REFRESH_TOKEN,
        },
      });

      return transporter;
    } catch (error: any) {
      logger.error(error, `[NODEMAILER] ${error?.message}`);
      throw new BaseError(error.name, error.statusCode, error.message, {
        ...error,
      });
    }
  };

export const createZohoMailTransporter =
  async (): Promise<nodemailer.Transporter> => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 587,
        secure: false,
        auth: {
          user: ZOHOMAIL,
          pass: ZOHOMAIL_PW,
        },
      });

      return transporter;
    } catch (error: any) {
      logger.error(error, `[NODEMAILER] ${error?.message}`);
      throw new BaseError(error.name, error.statusCode, error.message, {
        ...error,
      });
    }
  };
