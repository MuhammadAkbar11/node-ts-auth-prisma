import bcrypt from "bcrypt";
import { google } from "googleapis";
import {
  OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET,
  OAUTH_PLAYGROUND,
  OAUTH_REFRESH_TOKEN,
} from "../configs/vars.config";
import logger from "../configs/logger.config";
import BaseError from "../helpers/error.helper";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hashSync(password, salt);
}

export async function comparePassword(candidatePw: string, password: string) {
  return bcrypt.compare(candidatePw, password).catch(_e => false);
}

// Function to check if the Refresh Token has expired
export async function isOAuthRefreshTokenExpired() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      OAUTH_CLIENTID,
      OAUTH_CLIENT_SECRET,
      OAUTH_PLAYGROUND
    );

    oauth2Client.setCredentials({
      refresh_token: OAUTH_REFRESH_TOKEN + "xx",
    });

    // Call the getTokenInfo() method to get token information from Google
    const tokenInfo = await new Promise<string>((resolve, reject) => {
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

    // Check if the Refresh Token is still valid
    logger.info(`[UTILS] Google OAuth Refresh Token still valid :)`);
    return !tokenInfo;
  } catch (error: any) {
    logger.warn(
      error,
      `[UTILS] Error while checking Refresh Token : "${error.message}"`
    );

    return true;
  }
}
