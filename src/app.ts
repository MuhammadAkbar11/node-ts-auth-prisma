import express from "express";
import DemoRouter from "./app/demo/demo.routes";
import pinoHttpLogger from "./middlewares/logging.middleware";
import { ENV_STATIC_FOLDER_PATH, STATIC_FOLDER } from "./configs/vars.config";
import * as ENV from "./configs/vars.config";
import {
  logErrorMiddleware,
  returnError404Middleware,
  returnErrorMiddleware,
} from "./middlewares/error.middleware";
import { AutoBind } from "./utils/decorators.utils";
import UserRouter from "./app/user/user.routes";
import AuthRouter from "./app/auth/auth.routes";

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
    this.server.use(pinoHttpLogger);
    this.server.use(express.static(STATIC_FOLDER));
    if (ENV.MODE !== "production") {
      this.server.use(express.static(ENV_STATIC_FOLDER_PATH));
    }
  }

  @AutoBind
  routes() {
    const demoRouter = new DemoRouter();
    const userRouter = new UserRouter();
    const authRouter = new AuthRouter();
    this.server.use("/auth", authRouter.router);
    this.server.use("/users", userRouter.router);
    this.server.use("/", demoRouter.router);
  }

  errorMiddlewares() {
    this.server.use(logErrorMiddleware);
    this.server.use(returnError404Middleware);
    this.server.use(returnErrorMiddleware);
  }
}

export default new App().server;
