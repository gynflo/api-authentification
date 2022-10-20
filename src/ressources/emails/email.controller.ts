import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../utils/exceptions/http.exception";
import { Controller } from "../../utils/interfaces/controller.interface";
import EmailService from "./email.service";

export class EmailController implements Controller {
  public path = "/email";
  public router = Router();
  private EmailService = new EmailService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/verification/:userId/:token`,
      this.checkEmailIsVerified
    );
  }

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
