import { PORT, dotenvConfig } from "./configs/vars.config";
import app from "./app";
import logger from "./configs/logger.config";

dotenvConfig;

// console.log(process.env);
app.listen(PORT, () => logger.info(`[SERVER] app running on port ${PORT}`));
