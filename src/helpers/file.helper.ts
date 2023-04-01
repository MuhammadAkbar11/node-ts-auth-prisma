import fs from "fs";
import path from "path";
import sharp from "sharp";
import chalk from "chalk";
import dayJsUTC from "../utils/dayjs.utils";
import { ROOT_FOLDER, UPLOAD_PATH } from "../configs/vars.config";
import BaseError from "./error.helper";
import logger from "../configs/logger.config";

const bgWarn = chalk.bgHex("#EA7A20");

class FileHelper {
  constructor() {}

  static unlinkFile(filePath: string, isRootPath: boolean = true) {
    let file = path.join(filePath);

    if (isRootPath) {
      file = path.join(ROOT_FOLDER, filePath);
    }

    if (fs.existsSync(file)) {
      return fs.unlink(file, (err: any) => {
        if (err) {
          console.log(err);
          throw BaseError.transformError(err);
        }
        logger.warn(
          `${bgWarn(chalk.black(`[HELPER]`))} Delete file with path :${file}`
        );
        return true;
      });
    }

    return false;
  }

  static renameFile(
    oriName: string,
    prefix: string = "",
    name: string = "file"
  ) {
    const resultFileName = name
      .replace(/[^A-Za-z0-9]/g, "")
      .replace(/\s+/g, "")
      .trim();
    const filenameToArr = oriName.split(" ").join("").split(".");
    const ext = filenameToArr[filenameToArr.length - 1];
    return `${prefix}_${resultFileName}_${dayJsUTC().valueOf()}.${ext}`;
  }

  static async resizeImageUpload(
    fileimgData: Express.Multer.File & { folderPath: string },
    options: {
      prefix?: string;
      name?: string;
      width?: number;
      height?: number;
    } = {
      prefix: "",
      name: "file",
      width: 200,
      height: 200,
    }
  ) {
    const resultImg = this.renameFile(
      fileimgData.filename,
      options.prefix,
      options.name
    );
    const status = await sharp(fileimgData.path)
      .resize({
        height: options.height,
        width: options.width,
        fit: sharp.fit.fill,
        position: sharp.strategy.entropy,
        withoutEnlargement: true,
      })
      // .extract({ width: options?.width || 200, height: options?.height || 200 })
      .jpeg({ quality: 90 })
      .toFile(path.resolve(fileimgData.destination, resultImg));
    logger.info(status, "success resizing image fle");
    this.unlinkFile(fileimgData.path);
    return `/uploads${fileimgData.folderPath}/${resultImg}`;
  }
}

export default FileHelper;
