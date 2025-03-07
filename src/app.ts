import path from "path";
import dotenv from "dotenv";
import express from "express";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./config/database/data-source";
import {
  authorizationInterceptor,
  currentUserInterceptor,
} from "./config/http/interceptors";
import { createImagesDirectoryIfNotExists } from "./utils/files";

async function bootstrap() {
  const app = express();
  dotenv.config();

  useExpressServer(app, {
    cors: {
      origin: "*",
    },
    authorizationChecker: authorizationInterceptor,
    currentUserChecker: currentUserInterceptor,
    controllers: [path.join(__dirname + "/controllers/**/*.controller.ts")],
  });

  createImagesDirectoryIfNotExists();
  app.use(express.static("public"));
  app.use("/images", express.static("images"));

  await AppDataSource.initialize();
  console.info("Database connected");

  app.listen(3333, () => {
    console.log("Server is running in port 3333");
  });
}

bootstrap();
