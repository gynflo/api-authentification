"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
class UserController {
    path = "/users";
    router = (0, express_1.Router)();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.get(`${this.path}`, this.getCurrentUser);
    }
    register() { }
    login() { }
    getCurrentUser() { }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map