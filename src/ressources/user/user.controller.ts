import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../utils/exceptions/http.exception";
import { Controller } from "../../utils/interfaces/controller.interface";
import UserService from "./user.service";
//Middleware
import authenticatedMiddleware from "../../middlewares/authenticated.middleware";
//Sanitize Form Entries/Inputs
import { validationFormMiddleware } from "../../middlewares/validation.middleware";
import { registrationForm, loginForm } from "./user.validation";

//Email
import Email from "../../ressources/emails/email.config";


export class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //users/register
    this.router.post(
      `${this.path}/register`,
      validationFormMiddleware(registrationForm),
      this.register
    );
    //users/login
    this.router.post(
      `${this.path}/login`,
      validationFormMiddleware(loginForm),
      this.login
    );
    //users/current
    this.router.get(
      `${this.path}/current`,
      authenticatedMiddleware,
      this.getCurrentUser
    );
    //users/logout
    this.router.delete(
      `${this.path}/logout`,
      authenticatedMiddleware,
      this.logout
    );
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, email, password } = req.body;
      const user = await this.UserService.register(
        username,
        email,
        password,
        "user"
      );
      if (!user) {
        throw new Error("");
      }
      Email.sendEmailVerification({
        to: user.local.email,
        host: req.headers.host!,
        username: user.username,
        userId: user._id!,
        token: user.local.emailToken,
      });
      res.status(201).json({ user });
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
      res.status(204).cookie("token", token);
      res.end();
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private logout = async (_: Request, res: Response, __: NextFunction) => {
    res.clearCookie("token");
    res.end();
  };

  private getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const token = req.cookies.token;

    try {
      const user = await this.UserService.getUserByToken(token);
      res.status(200).json({ user });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };
}
