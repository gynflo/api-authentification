import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../utils/exceptions/http.exception";
import { Controller } from "../../utils/interfaces/controller.interface";
import UserService from "./user.service";

export class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

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

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, email, password } = req.body;
      const token = await this.UserService.register(
        username,
        email,
        password,
        "user"
      );
      res.status(201).json({ token });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };
  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserService.login(email, password);
      res.status(200).json({ token });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };
  private getCurrentUser = async () => {};
}
