import { HTTP_STATUS_CODE, MODE } from "../configs/vars.config";
import { ErrorData } from "../utils/types/interfaces";
import { getErrorSnippets } from "../utils/utils";

interface ValidationParam {
  type: string;
  message: string[];
}

interface ValidationErrors {
  [key: string]: ValidationParam;
}

class BaseError extends Error {
  statusCode: number;
  name: string;
  isOperational: boolean;
  errors?: Record<string, unknown>;
  validation?: ValidationErrors;

  constructor(
    name: string | null,
    statusCode: number,
    message: string,
    errors: ErrorData = {}
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name || "SERVER_ERROR";
    this.statusCode = statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER;
    this.isOperational = errors.isOperational ?? true;
    this.errors = errors;
    Error.captureStackTrace(this);
  }

  static transformError(error: BaseError): BaseError {
    const errors = {
      ...error.errors,
      isOperational: error.isOperational ?? false,
    } as any;
    if (!errors.isOperational && MODE === "development") {
      errors.stackTrace = getErrorSnippets(error);
    }
    return new BaseError(error.name, error.statusCode, error.message, errors);
  }

  // static validationError(errors: unknown[]): BaseError {
  //   const validationErrors: ValidationErrors = {};

  //   errors.forEach(error => {
  //     const { param, msg } = error as { param: string; msg: string };
  //     if (!validationErrors[param]) {
  //       validationErrors[param] = { type: param, message: [] };
  //     }
  //     validationErrors[param].message.push(msg);
  //   });

  //   return new BaseError(
  //     "BAD_VALIDATION",
  //     HTTP_STATUS_CODE.BAD_REQUEST,
  //     "Bad Validation",
  //     {
  //       isOperational: true,
  //       errors: validationErrors,
  //     }
  //   );
  // }
}

export default BaseError;
