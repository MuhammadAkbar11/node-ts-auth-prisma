import express from "express";

export class CoreRouter {
  public router: express.Router;
  constructor() {
    this.router = express.Router();
  }

  static routers() {
    return this.routers;
  }
}
