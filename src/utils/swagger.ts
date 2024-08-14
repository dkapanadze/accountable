import { Application, Express, Request, Response } from "express";
import { version } from "../../package.json";
import logger from "./logger";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as path from "path";
import YAML from "yamljs";

const apiPrefix = "/api/v1";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: version,
      description: "A simple library API",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}${apiPrefix}`, // Set the base URL for your API
        description: "Development server",
      },
    ],
    components: {
      securitySchema: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocument = YAML.load("./src/openapi.yaml");

function swaggerDocs(app: Application, port: number): void {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/swagger.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Swagger docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
