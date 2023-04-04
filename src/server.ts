import { PORT, SERVER_URL, dotenvConfig } from "./configs/vars.config";
import cron from "node-cron";
import app from "./app";
import logger from "./configs/logger.config";
import { dateUTC } from "./configs/date.config";
import prisma from "./configs/prisma.config";

dotenvConfig;

app.listen(PORT, () => logger.info(`[SERVER] app running on ${SERVER_URL}`));

cron.schedule(
  "* * * * *",
  async () => {
    logger.info("[SERVER][SCHEDULE] Checking expired sessions...");
    const expiredSessions = await prisma.session.deleteMany({
      where: {
        expired: {
          lt: dateUTC().toISOString(),
        },
      },
    });
    logger.info(expiredSessions, "[SERVER][SCHEDULE] Deleted expired sessions");
  },
  {
    timezone: "Asia/Jakarta",
    scheduled: true,
  }
);
