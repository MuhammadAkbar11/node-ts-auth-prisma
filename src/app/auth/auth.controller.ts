import { NextFunction, Request, Response } from "express";
import { BindAllMethods } from "../../utils/decorators.utils";
import AuthService from "./auth.service";
import { SignInUserInput, SignUpUserInput } from "./auth.schema";
import { Role } from "@prisma/client";
import {
  ACCESS_TOKEN_MAX_AGE,
  ACCESS_TOKEN_TTL,
  DEFAULT_USER_AVATAR,
  ENV_STATIC_FOLDER_PATH,
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_TTL,
} from "../../configs/vars.config";
import FileHelper from "../../helpers/file.helper";
import { BaseController } from "../../core";
import JWT from "../../helpers/jwt.helper";

@BindAllMethods
class AuthController extends BaseController {
  private readonly service = new AuthService();
  constructor() {
    super();
  }

  public async postSignUpUser(
    req: Request<{}, {}, SignUpUserInput["body"]>,
    res: Response,
    next: NextFunction
  ) {
    const fileimgData = req.fileimg?.data;
    let avatar = DEFAULT_USER_AVATAR;

    try {
      if (fileimgData) {
        avatar = await FileHelper.resizeImageUpload(fileimgData, {
          prefix: "AVATAR",
          name: "USER",
        });
      }

      const user = await this.service.signUpUser({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role as Role,
        avatar: avatar,
        status: "PENDING",
      });
      return res.status(201).json({
        message: "Sign up successfully",
        user: user,
      });
    } catch (error: any) {
      if (fileimgData) {
        FileHelper.unlinkFile(ENV_STATIC_FOLDER_PATH + avatar, false);
      }
      this.nextError(next, error);
    }
  }

  public async postSignInUser(
    req: Request<{}, {}, SignInUserInput["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await this.service.validateEmailAndPassword({
        email: req.body.email,
        password: req.body.password,
      });
      if (!user) {
        throw this.error("AUTH", 401, "Invalid Email or Password");
      }

      const existSession = await this.service.findUserSessions(
        user.id,
        req.get("user-agent") as string
      );

      let session = null;

      if (existSession && existSession?.length !== 0) {
        const sessionId = existSession[0].id as number;
        this.logger.info(existSession, "[AUTH] Session is found");
        await this.service.updateSessionStatusById(sessionId, true);
        session = await this.service.findSessionById(sessionId);
      } else {
        this.logger.info("[AUTH] No found session and created new session ");
        session = await this.service.createSession({
          userId: user.id,
          userAgent: req.get("user-agent") || "",
          valid: true,
        });
      }

      if (session) {
        const { id: sessionId } = session;
        const { refreshToken, accessToken } = this.service.setSessionToken(
          res,
          { user, sessionId: session.id }
        );

        return res.status(200).json({
          message: "Sign in successfully",
          user: { ...user, session: session.id },
          refreshToken,
          accessToken,
        });
      }

      return res.status(200).json({
        message: "Sign in failed",
        accessToken: null,
        refreshToken: null,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }

  public async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({
          message: "Failed to get user session",
          user: req.user ?? "TESS",
        });
      }

      const userId = user.id;

      const session = await this.prisma.session.findFirst({
        where: { user_id: userId, valid: true },
      });

      if (!session) {
        return res.status(401).json({
          message: "Session not found",
        });
      }

      return res.json({
        message: "Success to get user session",
        session,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }
}

export default AuthController;
