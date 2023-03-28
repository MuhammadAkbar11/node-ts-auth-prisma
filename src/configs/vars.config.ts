import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { ModeTypes } from "../utils/types/types";
import logger from "./logger.config";
import { string } from "zod";

const appDirname = path.resolve();

const isDevelopment = Boolean(process.env.TS_NODE_DEV);
let mode: ModeTypes = isDevelopment ? "development" : "production";

const envPath = {
  production: path.join(appDirname, ".env"),
  development: path.join(appDirname, ".env.dev"),
  testing: path.join(appDirname, ".env.test"),
};

export const dotenvConfig = dotenv.config({
  path: envPath[mode],
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

let uploadPath = STATIC_FOLDER + "/uploads";

if (mode !== "production") {
  uploadPath = `${ENV_STATIC_FOLDER_NAME}/uploads`;
  if (!fs.existsSync(path.join(ROOT_FOLDER, uploadPath))) {
    logger.warn(`[SERVER] ${mode} directory not found!`);
    try {
      fs.mkdirSync(path.join(ROOT_FOLDER, uploadPath), { recursive: true });
    } catch (error) {
      logger.warn(error, `[SERVER] ${mode} directory fail to create!`);
    }
    logger.info(`[SERVER] ${mode} directory created!`);
  } else {
    logger.info(`[SERVER] ${mode} directory founded!`);
  }
}

export const PORT = process.env.PORT || 3000;
export const MODE = mode;
export const DATABASE_URL = process.env.DATABASE_UR as string;
export const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
export const PUBLIC_KEY = process.env.PUBLIC_KEY as string;
export const UPLOAD_PATH = uploadPath;

export const HTTP_STATUS_CODE = {
  OK: 200,
  EDIT: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PLAYER: "PLAYER",
};

export const ROLES_ARR = [
  {
    value: "SUPER_ADMIN",
    text: "Superadmin",
  },
  {
    value: "SUPER_ADMIN",
    text: "Admin",
  },
  {
    value: "SUPER_ADMIN",
    text: "Player",
  },
];

export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
};
