import path from "path";
import dotenv from "dotenv";
import express from "express";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./config/database/data-source";
import { authorizationInterceptor } from "./config/database/http/interceptors";

async function bootstrap() {
  const app = express();
  dotenv.config();

  useExpressServer(app, {
    cors: {
      origin: "*",
    },
    authorizationChecker: authorizationInterceptor,
    controllers: [path.join(__dirname + "/controllers/**/*.controller.ts")],
  });

  await AppDataSource.initialize();
  console.info("Database connected");

  app.listen(3333, () => {
    console.log("Server is running in port 3333");
  });
}

bootstrap();
