export interface IJwtPayload {
  valid: boolean;
  expired: boolean;
  decoded: any;
}

export interface ErrorData {
  isOperational?: boolean;
  [key: string]: any;
}
