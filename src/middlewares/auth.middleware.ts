import express from "express";
import chalk from "chalk";
import { User } from "@prisma/client";
import _ from "lodash";
import JWT from "../helpers/jwt.helper";
import AuthService from "../app/auth/auth.service";
import logger from "../configs/logger.config";

import { ACCESS_TOKEN_MAX_AGE } from "../configs/vars.config";

const authService = new AuthService();

interface IUserReq extends Omit<User, "password"> {
  session?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserReq;
    }
  }
}

function getTokens(req: express.Request): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken =
    req.cookies?.accessToken ||
    _.get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  const refreshToken =
    req.cookies?.refreshToken || _.get(req, "headers.x-refresh");
  return { accessToken, refreshToken };
}

function setNewAccessTokenCookie(
  req: express.Request,
  res: express.Response,
  accessToken: string
) {
  const userAgent = req.get("user-agent");

  res.cookie("accessToken", accessToken, {
    maxAge: ACCESS_TOKEN_MAX_AGE, // 5 minutes
    httpOnly: true,
  });
  if (userAgent?.includes("Postman")) {
    logger.info("[SESSION] Set x-access-token for Postman");
    res.setHeader("x-access-token", accessToken);
  }
}

export async function deserializeUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // logger.info(, "accessToken & refreshToken");
    const { accessToken, refreshToken } = getTokens(req);

    if (!accessToken) {
      const { decoded: refresh } = refreshToken
        ? JWT.verifyJWT(refreshToken)
        : { decoded: null };

      if (!refresh) {
        logger.warn("[SESSION] No authorized (!accessToken && !refreshToken)");
        return next();
      }

      const session = await new AuthService().findValidSessionById(
        refresh.session
      );

      if (!session) {
        logger.warn("[SESSION] Session not found (!accessToken)");
        return next();
      }

      const newAccessToken = await authService.reIssueAccessToken({
        refreshToken,
      });

      if (newAccessToken) {
        setNewAccessTokenCookie(req, res, newAccessToken as string);

        const result = JWT.verifyJWT((newAccessToken as string) || "");
        const user = await authService.getSessionUser(
          result.decoded?.id as number
        );
        req.user = {
          ...user,
          session: result?.decoded?.session as number,
        } as IUserReq;
        logger.info(
          "[SESSION] Expired access token & generated new access token"
        );
      } else {
        logger.warn(
          `[SESSION] Expired access token & try to generated new access token but it failed`
        );
      }
      return next();
    }

    const { decoded: decodedAccess, expired } = JWT.verifyJWT(accessToken);

    // For a valid access token
    if (decodedAccess) {
      const validSessionWithAccessToken =
        await new AuthService().findValidSessionById(decodedAccess.session);

      if (!validSessionWithAccessToken) {
        logger.warn("[SESSION] Session not found (accessToken)");
        return next();
      }

      const currentUser = (await authService.getSessionUser(
        validSessionWithAccessToken.user_id
      )) as User;

      req.user = {
        ...currentUser,
        session: validSessionWithAccessToken.id,
      } as IUserReq;
      logger.info(
        {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          session: validSessionWithAccessToken.id,
          userAgent: req.get("user-agent") as string,
        },
        `[SESSION] Session found and return current user data`
      );
      logger.info(
        `[SESSION] current user is ${currentUser.name}:${currentUser.email} `
      );

      return next();
    }

    const { decoded: decodedRefreshToken } =
      expired && refreshToken ? JWT.verifyJWT(refreshToken) : { decoded: null };

    if (!decodedRefreshToken) {
      logger.warn("[SESSION] No authorized (!decodedRefreshToken)");
      return next();
    }

    const validSessionWithRefreshToken = await authService.findValidSessionById(
      decodedRefreshToken.session
    );

    if (!validSessionWithRefreshToken) {
      logger.warn(
        "[SESSION] Session not found (!validSessionWithRefreshToken)"
      );
      return next();
    }

    const newAccessToken = await authService.reIssueAccessToken({
      refreshToken,
    });

    if (newAccessToken) {
      const { decoded: newDecodedAccessToken } = JWT.verifyJWT(
        (newAccessToken as string) || ""
      );
      const user = await authService.getSessionUser(
        newDecodedAccessToken?.id as number
      );
      req.user = {
        ...user,
        session: newDecodedAccessToken?.session as number,
      } as IUserReq;
      setNewAccessTokenCookie(req, res, newAccessToken as string);
      logger.info("[SESSION] Generated new access token");
    } else {
      logger.warn(`[SESSION] Try to generated new access token but it failed`);
    }
    return next();
  } catch (error) {
    logger.error(error, "[SESSION] deserialize user failed");
    next();
  }
}

export function requiredUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const user = req.user;
  if (!user) {
    return res.status(403).json({
      message: "Not authorized!",
    });
  }

  return next();
}
