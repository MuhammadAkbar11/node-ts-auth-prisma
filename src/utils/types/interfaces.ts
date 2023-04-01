export interface IJwtPayload {
  valid: boolean;
  expired: boolean;
  decoded: any;
}

export interface ErrorData {
  isOperational?: boolean;
  [key: string]: any;
}

export interface IFileImg {
  type: string;
  message: string;
  data: (Express.Multer.File & { folderPath: string }) | null;
}
