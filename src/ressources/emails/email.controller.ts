import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../utils/exceptions/http.exception";
import { Controller } from "../../utils/interfaces/controller.interface";
import EmailService from "./email.service";
import Email from "./email.config";
//Sanitize Form Entries/Inputs
import { passwordFormInput, emailFormInput } from "./email.validation";
import { validationFormMiddleware } from "../../middlewares/validation.middleware";

export class EmailController implements Controller {
  public path = "/email";
  public router = Router();
  private EmailService = new EmailService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /email/verification/:userId/:token
    this.router.get(
      `${this.path}/verification/:userId/:token`,
      this.checkEmailIsVerified
    );
    // POST /email/forgot-password    [1]
    this.router.post(
      `${this.path}/forgot-password`,
      validationFormMiddleware(emailFormInput),
      this.initResetPassword
    );
    // POST /email/reset-password
    this.router.post(
      `${this.path}/reset-password/:userId/:token`,
      validationFormMiddleware(passwordFormInput),
      this.resetPassword
    );
    //GET /email/reset-password/:userId/:token   [2]
    this.router.get(
      `${this.path}/reset-password/:userId/:token`,
      this.resetPasswordForm
    );
  }

  private resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, token } = req.params;
      const { password } = req.body;
      await this.EmailService.resetPassword(userId, token, password);
      res.status(204).json(null);
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private resetPasswordForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, token } = req.params;
      const user = await this.EmailService.resetPasswordForm(userId, token);
      console.log(
        "🚀 ~ file: email.controller.ts ~ line 58 ~ EmailController ~ user",
        user
      );
      if (user) {
        if (user && token === user.local.passwordToken) {
          return res.render("auth/authResetPassword", {
            url: `http://${req.headers.host}/api/v1/email/reset-password/${user._id}/${user.local.passwordToken}`,
            error: null,
            isAuthenticated: false,
          });
        } else {
          next(new HttpException(400, "Token does not match !"));
        }
      }
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private initResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email } = req.body;
      if (email) {
        const user = await this.EmailService.initResetPassword(email);
        if (user) {
          Email.sendResetPasswordLink({
            to: email,
            host: req.headers.host!,
            userId: user._id,
            token: user.local.passwordToken!,
          });
        }

        res.status(200).end();
      } else return next(new HttpException(404, "User Unknown !"));
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private checkEmailIsVerified = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, token } = req.params;
      await this.EmailService.verificationEmail(userId, token);
      return res.status(204).end();
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };
}
