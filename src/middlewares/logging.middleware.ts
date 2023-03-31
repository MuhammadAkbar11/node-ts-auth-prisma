import chalk from "chalk";
import pinoHttp from "pino-http";
import logger from "../configs/logger.config";
import { IncomingMessage } from "http";
import { ServerResponse } from "http";

const textWhite = chalk.hex("#DFDFDE");
const bgWhite = chalk.bgHex("#DFDFDE");

interface HttpMethodColors {
  [key: string]: (value: string) => string;
}

const httpMethodColors: HttpMethodColors = {
  GET: (value: string) => bgWhite(chalk.black(`[${value}]`)),
  POST: (value: string) => chalk.bgGreen(chalk.black(`[${value}]`)),
  PUT: (value: string) => chalk.bgCyan(chalk.black(`[${value}]`)),
  DELETE: (value: string) => chalk.bgRed(chalk.black(`[${value}]`)),
  DEFAULT: (value: string) => chalk.bgCyan(chalk.black(`[${value}]`)),
};

const log = pinoHttp({
  logger: logger,
  serializers: {
    res() {
      return undefined;
    },
    req() {
      return undefined; // Remove 'req' from logs
    },
    timeTaken() {
      return undefined;
    },
  },

  customSuccessMessage: function (req: IncomingMessage, res: ServerResponse) {
    const reqMethod = req?.method as string;

    const method = (httpMethodColors[reqMethod] || httpMethodColors["DEFAULT"])(
      reqMethod
    );

    const url = textWhite(`- ${req.url} -`);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return `${method} ${url} ${chalk.green(res.statusCode)}`;
    }

    if (res.statusCode === 404) {
      return `${method} ${url} ${chalk.yellow(res.statusCode)}`;
    }

    if (res.statusCode >= 300 && res.statusCode < 400) {
      return `${method} ${url} ${chalk.white(res.statusCode)}`;
    }

    if (res.statusCode === 500) {
      return `${method} ${url} ${chalk.red(res.statusCode)}`;
    }
    // Logger.info();
    return `${method} ${url} ${res.statusCode}`;
  },

  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "timeTaken",
  },
});

const pinoHttpLogger = (req: any, res: any, next: any) => {
  log(req, res);
  next();
};

export default pinoHttpLogger;
