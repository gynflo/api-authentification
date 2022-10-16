import express, { Application } from "express";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

class App {
  public express: Application;
  public port: number;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
  }

  private initializeDatabaseConnection() {
    const { URLDATABASE, NAMECOLLECTIONDATABASE } = process.env;
    mongoose.connect(`${URLDATABASE}`).then(() => {
      console.log(`${NAMECOLLECTIONDATABASE} connexion OK`);
    });
  }

  private initializeMiddleware() {
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listen on http://localhost:${this.port}`);
    });
  }
}

export default App;