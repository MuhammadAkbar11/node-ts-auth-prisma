import express, { RequestHandler } from "express";

export class CoreRouter<T> {
  public router: express.Router;
  public controller: T;
  constructor(Controller: new () => T) {
    this.router = express.Router();
    this.controller = new Controller();
  }

  static routers() {
    return this.routers;
  }
}
