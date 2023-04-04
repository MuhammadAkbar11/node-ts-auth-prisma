import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../configs/vars.config";
import { IJwtPayload, ISession } from "../utils/types/interfaces";
import { BindAllMethods } from "../utils/decorators.utils";
import logger from "../configs/logger.config";

@BindAllMethods
abstract class JWT {
  static signJWT(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, PRIVATE_KEY, {
      ...(options && options),
      algorithm: "RS256",
      allowInsecureKeySizes: true,
      allowInvalidAsymmetricKeyTypes: true,
    });
  }

  static verifyJWT(token: string): IJwtPayload {
    try {
      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ["RS256"],
        allowInvalidAsymmetricKeyTypes: true,
      }) as ISession;
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (error: any) {
      logger.warn(`[HELPER][JWT] ${error?.message || "Jwt Error"}`);
      return {
        valid: false,
        expired: error.message.includes("jwt expired"),
        decoded: null,
      };
    }
  }
}

export default JWT;
