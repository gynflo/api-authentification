import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller.interface";

export class UserController implements Controller {
  public path = "/users";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //users/register
    this.router.post(`${this.path}/register`, this.register);
    //users/login
    this.router.post(`${this.path}/login`, this.login);
    //users
    this.router.get(`${this.path}`, this.getCurrentUser);
  }

  private register() {}
  private login() {}
  private getCurrentUser() {}
}
