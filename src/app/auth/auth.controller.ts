import { NextFunction, Request, Response } from "express";
import { CoreController } from "../../core/controller.core";
import { BindAllMethods } from "../../utils/decorators.utils";
import { CreateUserInput } from "../user/user.schema";
import AuthService from "./auth.service";
import { Role } from "@prisma/client";
import {
  DEFAULT_USER_AVATAR,
  ENV_STATIC_FOLDER_PATH,
} from "../../configs/vars.config";
import FileHelper from "../../helpers/file.helper";

@BindAllMethods
class AuthController extends CoreController {
  private service = new AuthService();
  constructor() {
    super();
  }

  public async signupUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
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

      const user = await this.service.createUser({
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
}

export default AuthController;
