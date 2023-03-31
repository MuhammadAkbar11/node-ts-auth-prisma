import { PORT, SERVER_URL, dotenvConfig } from "./configs/vars.config";
import app from "./app";
import logger from "./configs/logger.config";

dotenvConfig;

app.listen(PORT, () => logger.info(`[SERVER] app running ${SERVER_URL}`));
