"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
class App {
    express;
    port;
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initializeControllers(controllers);
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api/v1", controller.router);
        });
    }
    initializeDatabaseConnection() {
        const { URLDATABASE, NAMECOLLECTIONDATABASE } = process.env;
        mongoose_1.default.connect(`${URLDATABASE}`).then(() => {
            console.log(`${NAMECOLLECTIONDATABASE} connexion OK`);
        });
    }
    initializeMiddleware() {
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use((0, helmet_1.default)());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, compression_1.default)());
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`App listen on http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map