import envVars from "./config/validateEnv";
import { connectToMongoDB } from "./config/mongoose";
import logger from "./utils/logger";
import app from "./app";

global.logger = logger;

const PORT = envVars.PORT || 3000;

const setupGlobalErrorHandlers = () => {
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err: any) => {
    logger.error("Unhandled Rejection:", err);
    process.exit(1);
  });

  process.on("exit", (code) => {
    logger.info(`Process exiting with code: ${code}`);
  });
};

const main = async () => {
  setupGlobalErrorHandlers();
  await connectToMongoDB();

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

main();
