import express from "express";
import cors from "cors";
import DemoRouter from "./app/demo/demo.routes";
import pinoHttpLogger from "./middlewares/logging.middleware";
import { ENV_STATIC_FOLDER_PATH, STATIC_FOLDER } from "./configs/vars.config";
import * as ENV from "./configs/vars.config";
import {
  logErrorMiddleware,
  returnError404Middleware,
  returnErrorMiddleware,
} from "./middlewares/error.middleware";
import AuthRouter from "./app/auth/auth.routes";
import ProfileRouter from "./app/profile/profile.routes";
import { deserializeUser } from "./middlewares/auth.middleware";
import EmailRouter from "./app/email/email.routes";

class App {
  public server;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorMiddlewares();
  }

  middlewares() {
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(deserializeUser);
    this.server.use(pinoHttpLogger);
    this.server.use(express.static(STATIC_FOLDER));
    if (ENV.MODE !== "production") {
      this.server.use(express.static(ENV_STATIC_FOLDER_PATH));
    }
  }

  routes() {
    const demoRouter = new DemoRouter(this.server);
    const emailRouter = new EmailRouter(this.server);
    const profileRouter = new ProfileRouter(this.server);
    const authRouter = new AuthRouter(this.server);
    this.server.use("/auth", authRouter.getRouter());
    this.server.use("/profile", profileRouter.getRouter());
    this.server.use("/email", emailRouter.getRouter());
    this.server.use("/", demoRouter.getRouter());
  }

  errorMiddlewares() {
    this.server.use(logErrorMiddleware);
    this.server.use(returnError404Middleware);
    this.server.use(returnErrorMiddleware);
  }
}

export default new App().server;
