import path from "path";
import dotenv from "dotenv";
import express from "express";
import { useExpressServer } from "routing-controllers";

async function bootstrap() {
  const app = express();
  dotenv.config();

  useExpressServer(app, {
    cors: {
      origin: "*",
    },
    controllers: [path.join(__dirname + "/controllers/**/*.controller.ts")],
  });

  app.listen(3333, () => {
    console.log("Server is running in port 3333");
  });
}

bootstrap();
