import path from "path";
import nodemailer from "nodemailer";
import pug from "pug";

import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import { OptionsUser } from "./email.interface";
export type Transporter<T = any> = Mail<T>;

class Email {
  from: string;
  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.from = "Gynflo Site&#60;no-reply@gynflo.site>";
    if ((process.env.NODE_ENV === "production")) {
      this.transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PWD,
        },
      });
    } else {
      // Utilisation de MailTrap pour le développement
      this.transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PWD,
        },
      });
    }
  }

  async sendEmailVerification(options: OptionsUser) {
    try {
      const email = {
        from: this.from,
        subject: "Email Verification",
        to: options.to,
        html: pug.renderFile(
          path.join(__dirname, "/templates/emailVerification.pug"),
          {
            username: options.username,
            url: `http://${options.host}/api/v1/email/verification/${options.userId}/${options.token}`,
          }
        ),
      };
      await this.transporter.sendMail(email);
    } catch (e: any) {
      throw e;
    }
  }
}

export default new Email();
