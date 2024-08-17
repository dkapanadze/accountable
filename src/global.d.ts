import { Logger } from "winston";

declare namespace NodeJS {
  interface Global {
    logger: typeof logger;
  }
}

export {};
