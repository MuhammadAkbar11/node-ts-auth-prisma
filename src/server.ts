import path from "path";
import {
  ENV_STATIC_FOLDER_NAME,
  PORT,
  dotenvConfig,
} from "./configs/vars.config";
import app from "./app";
import logger from "./configs/logger.config";

dotenvConfig;

console.log(ENV_STATIC_FOLDER_NAME);
// console.log(process.env);
app.listen(PORT, () => logger.info(`[SERVER] app running on port ${PORT}`));
