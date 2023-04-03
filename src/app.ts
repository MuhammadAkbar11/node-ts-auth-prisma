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

  routes() {
    const demoRouter = new DemoRouter(this.server);
    // const userRouter = new UserRouter();
    const authRouter = new AuthRouter(this.server);
    this.server.use("/auth", authRouter.getRouter());
    // this.server.use("/users", userRouter.router);
    this.server.use("/", demoRouter.getRouter());
  }

  errorMiddlewares() {
    this.server.use(logErrorMiddleware);
    this.server.use(returnError404Middleware);
    this.server.use(returnErrorMiddleware);
  }
}

export default new App().server;
