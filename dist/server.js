"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
exports.app.use((req, res, next) => {
    console.log(req.url);
    next();
});
exports.app.get("*", (_, res) => {
    res.sendFile(path_1.default.join(__dirname, "../dist/index.html"));
});
exports.app.listen(5000, () => {
    console.log("Serveur Listening on port 5000");
});
//# sourceMappingURL=server.js.map