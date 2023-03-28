import express from "express";
import DemoRouter from "./app/demo/demo.routes";

class App {
  public server;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    const demoRouter = new DemoRouter();
    this.server.use("/", demoRouter.router);
  }
}

export default new App().server;
