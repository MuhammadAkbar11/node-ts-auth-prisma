import multer from "multer";
import Upload from "../helpers/upload.helper";
import { Request, Response, NextFunction } from "express";
import { UPLOAD_PATH } from "../configs/vars.config";
import { IFileImg } from "../utils/types/interfaces";

declare global {
  namespace Express {
    interface Request {
      fileimg?: IFileImg;
    }
  }
}

const uploadSingleImage =
  (folderPath = "/files") =>
  (req: Request, res: Response, next: NextFunction) => {
    const folderName = UPLOAD_PATH + folderPath;
    const uploadSingle = new Upload({
      fieldName: "image",
      folderName: folderName,
      filename: req.body.filename,
    });
    return uploadSingle.single()(req, res, function (err: any) {
      let file = {
        type: "success",
        message: "Upload file success",
        data: {
          folderPath,
          ...req.file,
        },
      } as IFileImg;
      if (err instanceof multer.MulterError) {
        file = {
          type: "error",
          message: "Failed to upload",
          data: null,
        };
        req.fileimg = file;
        next();
      } else if (err) {
        file = {
          type: "error",
          message: "Failed to upload",
          data: null,
        };
        req.fileimg = file;
        next();
      } else {
        if (req.file === undefined) {
          file = {
            type: "warning",
            message: "Please upload your file",
            data: null,
          };
        }
        req.fileimg = file;
        next();
      }
    });
  };

export default uploadSingleImage;
