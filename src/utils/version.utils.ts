import * as fs from "fs";
import path from "path";
import { ROOT_FOLDER } from "../configs/vars.config";

function apiVersion(): string {
  const packageJson = fs.readFileSync(
    path.join(ROOT_FOLDER, "package.json"),
    "utf8"
  );
  const { version } = JSON.parse(packageJson);
  return version;
}

export default apiVersion;
