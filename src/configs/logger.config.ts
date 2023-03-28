import pino from "pino";
import pinoPretty from "pino-pretty";
import { dateUTC } from "./date.config";

const timeformat = "DD.MM.YYYY HH:mm:ss";
const time = dateUTC().tz("Asia/Jakarta").format(timeformat);

const streams = [
  {
    stream: pinoPretty({
      colorize: true,
      destination: 1,
      ignore: "pid",
    }),
  },
];

const logger = pino(
  {
    prettifier: true,
    level: "info",
    formatters: {
      level: label => {
        return { level: label };
      },
    },
    timestamp: () => `,"time": "${time}"`,
  },
  pino.multistream(streams)
);

export default logger;
