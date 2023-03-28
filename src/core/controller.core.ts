// import { PrismaClient } from "@prisma/client";

import { HTTP_STATUS_CODE } from "../configs/vars.config";

export class CoreController {
  // public prisma: PrismaClient;
  public methodStatus = HTTP_STATUS_CODE;

  constructor() {
    // this.prisma = new PrismaClient();
  }
}
