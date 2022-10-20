import Mail from "nodemailer/lib/mailer";


export interface OptionsUser extends Mail.Options {
  username: String;
  host: String;
  userId: String;
  token: String;
}
