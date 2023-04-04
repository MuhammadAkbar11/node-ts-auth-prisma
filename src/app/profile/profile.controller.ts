import { NextFunction, Request, Response } from "express";
import { BindAllMethods } from "../../utils/decorators.utils";
import { BaseController } from "../../core";

@BindAllMethods
class ProfileController extends BaseController {
  constructor() {
    super();
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({
          message: "Failed to get user session",
        });
      }

      const userId = user.id;

      const profile = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      res.status(200).json({
        message: "Success get user profile",
        user: profile,
      });
    } catch (error: any) {
      this.nextError(next, error);
    }
  }
}

export default ProfileController;
