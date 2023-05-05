import * as prisma from "@prisma/client";

export interface ISession extends Omit<prisma.User, "password"> {
  session: number;
  iat: number;
  exp: number;
}

export interface IJwtPayload {
  valid: boolean;
  expired: boolean;
  decoded: ISession | null;
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

export interface IGenerateAutoIncFieldHelper {
  prismaTx?: prisma.Prisma.TransactionClient;
  tableName: string;
  field: string;
  length?: number;
}
