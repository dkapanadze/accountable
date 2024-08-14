import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import AppError from "./utils/AppError";
import errorHandler from "./middlewares/errorHandler";
import router from "./routes";
import "./jobs";
import swaggerDocs from "./utils/swagger";

const app: Application = express();

app.use(cors());
app.use(helmet());

app.use(express.json());

swaggerDocs(app, process.env.PORT ? parseInt(process.env.PORT) : 8080);

app.use("/api/v1", router);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

export default app;
