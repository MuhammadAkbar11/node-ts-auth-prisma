import { HTTP_STATUS_CODE, MODE } from "../configs/vars.config";
import { ErrorData } from "../utils/types/interfaces";
import _ from "lodash";
import { getErrorSnippets, objHasKey } from "../utils/utils";

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
    let errors: Record<string, unknown> = {
      ...error.errors,
      isOperational: error.isOperational ?? false,
    };
    if (!errors.isOperational) {
      if (!objHasKey(errors, "stackTrace")) {
        _.set(errors, "stackTrace", getErrorSnippets(error) as any);
      }
    } else {
      if (objHasKey(errors, "stackTrace")) {
        _.unset(errors, "stackTrace");
      }
    }
    return new BaseError(error.name, error.statusCode, error.message, errors);
  }
}

export default BaseError;
