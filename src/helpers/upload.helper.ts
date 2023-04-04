import path from "path";
import multer, { StorageEngine } from "multer";
import dayjs from "dayjs";
import fs from "fs";
import { ROOT_FOLDER, UPLOAD_PATH } from "../configs/vars.config";
import logger from "../configs/logger.config";
import BaseError from "./error.helper";

interface UploadOptions {
  fieldName?: string;
  folderName?: string;
  fileTypes?: RegExp;
  filename?: string;
}

class Upload {
  private fieldName: string;
  private folderName: string;
  private fileTypes: RegExp;
  private filename: string;

  constructor({
    fieldName = "image",
    folderName = UPLOAD_PATH,
    fileTypes = /jpg|jpeg|png/,
    filename = "image",
  }: UploadOptions) {
    this.fieldName = fieldName;
    this.folderName = folderName;
    this.fileTypes = fileTypes;
    this.filename = filename;

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(path.join(ROOT_FOLDER, folderName), { recursive: true });
    }
  }

  diskStorage(): StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.folderName);
      },
      filename: (req, file, cb) => {
        logger.info(file, "[UPLOAD] Request new file");
        let filename = req.body.filename ?? this.filename;
        if (!filename) {
          filename = file.fieldname;
        }

        const resultFileName = filename
          .replace(/[^A-Za-z0-9]/g, "")
          .replace(/\s+/g, "")
          .trim();
        const filenameToArr = file.originalname.split(" ").join("").split(".");
        const ext = filenameToArr[filenameToArr.length - 1];
        cb(null, `${resultFileName}_${dayjs().valueOf()}.${ext}`);
      },
    });
  }

  checkFileType(
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    const extname = this.fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = this.fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new BaseError("Multer", 500, "Images Only", { isOperational: true }));
    }
  }

  single() {
    const storage = this.diskStorage();
    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        this.checkFileType(file, cb);
      },
    }).single(this.fieldName);
  }
}

export default Upload;
