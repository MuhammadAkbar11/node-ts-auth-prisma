import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import os from "os";
import { ModeTypes } from "../utils/types/types";
import logger from "./logger.config";

const appDirname = path.resolve();

let mode: ModeTypes = Boolean(process.env.TS_NODE_DEV)
  ? "development"
  : "production";

const envFilePaths = {
  production: path.join(appDirname, ".env"),
  development: path.join(appDirname, ".env.development"),
  testing: path.join(appDirname, ".env.test"),
};

const envFile = envFilePaths[mode] || envFilePaths["production"];

if (envFile) {
  logger.info(`[SERVER] env file is founded : (${envFile})!`);
}

export const dotenvConfig = dotenv.config({
  path: envFile,
});

if (process.env.NODE_ENV === "testing") {
  mode = "testing";
}

export const SUPERADMIN_EMAIL = "superadmin@storegg.com";
export const STATIC_FOLDER = path.join(appDirname, "public");
export const ROOT_FOLDER = appDirname;

const publicFolders = {
  testing: ".node_test",
  development: ".node_dev",
  production: "public",
};

export const ENV_STATIC_FOLDER_NAME = publicFolders[mode];
export const ENV_STATIC_FOLDER_PATH = path.join(
  ROOT_FOLDER,
  publicFolders[mode] || publicFolders["production"]
);

let uploadPath = ENV_STATIC_FOLDER_NAME + "/uploads";

if (mode !== "production") {
  uploadPath = `${ENV_STATIC_FOLDER_NAME}/uploads`;
  if (!fs.existsSync(path.join(ROOT_FOLDER, uploadPath))) {
    logger.warn(`[SERVER] ${mode} directory not found!`);
    try {
      fs.mkdirSync(path.join(ROOT_FOLDER, uploadPath), { recursive: true });
    } catch (error) {
      logger.warn(error, `[SERVER] ${mode} directory fail to create!`);
    }
    logger.info(`[SERVER] ${mode} directory created! with path ${uploadPath}`);
  } else {
    logger.info(`[SERVER] ${mode} directory founded! with path ${uploadPath}`);
  }
} else {
  logger.info(`[SERVER] ${mode} directory founded! with path ${uploadPath}`);
}

export const HOSTNAME = os.hostname();
export const PORT = process.env.PORT || 3000;
export const MODE = mode;
export const DATABASE_URL = process.env.DATABASE_UR as string;
export const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
export const PUBLIC_KEY = process.env.PUBLIC_KEY as string;
export const OAUTH_REFRESH_TOKEN = process.env?.OAUTH_REFRESH_TOKEN as string;
export const OAUTH_CLIENTID = process.env?.OAUTH_CLIENTID as string;
export const OAUTH_CLIENT_SECRET = process.env?.OAUTH_CLIENT_SECRET as string;
export const OAUTH_PLAYGROUND = process.env?.OAUTH_PLAYGROUND as string;
export const GMAIL = process.env?.GMAIL as string;
export const ZOHOMAIL = process.env?.ZOHOMAIL as string;
export const ZOHOMAIL_PW = process.env?.ZOHOMAIL_PW as string;
export const DEVS_EMAIL = (process.env?.DEVS_EMAIL as string) || GMAIL;

export const UPLOAD_PATH = uploadPath;
export const SERVER_URL =
  MODE === "development"
    ? `http://localhost:${PORT}/`
    : `http://${HOSTNAME}:${PORT}/`;

export const DEFAULT_USER_AVATAR = "/images/avatar.jpeg";

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL = "7d";
export const REFRESH_TOKEN_MAX_AGE = 300000; // 5 minutes
export const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 5 minutes

export const HTTP_STATUS_CODE = {
  OK: 200,
  EDIT: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

export const ROLES = {
  // SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
};

export const ROLES_ARR = [
  // {
  //   value: "SUPER_ADMIN",
  //   text: "Superadmin",
  // },
  {
    value: "ADMIN",
    text: "Admin",
  },
  {
    value: "USER",
    text: "USER",
  },
];

export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
};
