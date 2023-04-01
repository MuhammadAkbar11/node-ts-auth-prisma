import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../configs/vars.config";
import { IJwtPayload } from "./types/interfaces";
import { AutoBind } from "./decorators.utils";

abstract class JWT {
  @AutoBind
  static signJWT(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, PRIVATE_KEY, {
      ...(options && options),
      algorithm: "RS256",
    });
  }

  @AutoBind
  static verifyJwt(token: string): IJwtPayload {
    try {
      const decoded = jwt.verify(token, PUBLIC_KEY);

      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (error: any) {
      return {
        valid: false,
        expired: error.message === "jwt expired",
        decoded: null,
      };
    }
  }
}

export default JWT;
