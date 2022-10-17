import express, { Application } from "express";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//Interface
import type { Controller } from "./utils/interfaces/controller.interface";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", controller.router);
    });
  }

  private initializeDatabaseConnection(): void {
    const { URL_DATABASE, NAME_COLLECTION_DATABASE } = process.env;
    mongoose.connect(`${URL_DATABASE}`).then(() => {
      console.log(`${NAME_COLLECTION_DATABASE} connexion OK`);
    });
  }

  private initializeMiddleware(): void {
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser());
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listen on http://localhost:${this.port}`);
    });
  }
}

export default App;
