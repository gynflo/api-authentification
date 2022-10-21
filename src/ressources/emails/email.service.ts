import UserModel from "../user/user.model";
import { v4 as uuid } from "uuid";
import moment from "moment";

class EmailService {
  private user = UserModel;

  public async verificationEmail(userId: string, token: string) {
    try {
      const user = await this.user.findById(userId);
      if (!user) {
        throw new Error(`Unable to find user with that ID`);
      }
      if (token && token === user.local.emailToken) {
        user.local.isCheckEmail = true;
        await user.save();
        return user;
      } else {
        throw new Error("Token Email does not match !");
      }
    } catch (e: any) {
      throw new Error("Something went wrong with verificationEmail");
    }
  }

  public async initResetPassword(email: string) {
    try {
      const user = await this.user.findOne({ "local.email": email });
      if (!user) {
        throw new Error(`Unable to find user with that Email`);
      }
      //Je génère un uuid pour l'utiliser comme token
      user.local.passwordToken = uuid();
      // Je fixe une date d'expiration pour le token (2 heures)
      user.local.passwordTokenExpiration = moment().add(2, "hours").toDate();
      // Enfin , sauvegarde des modifications
      await user.save();
      return user;
    } catch (e: any) {
      throw new Error("Something went wrong with initResetPasswordForm");
    }
  }

  public async resetPasswordForm(userId: string, token: string) {
    console.log(
      "🚀 ~ file: email.service.ts ~ line 41 ~ EmailService ~ resetPasswordForm ~ token",
      token
    );
    try {
      const user = await this.user.findById(userId);
      if (!user) {
        throw new Error(`Unable to find user with that ID`);
      }
      console.log(
        "🚀 ~ file: email.service.ts ~ line 44 ~ EmailService ~ resetPasswordForm ~ user",
        user
      );
      return user;
    } catch (e: any) {
      throw new Error("Something went wrong with resetPasswordForm");
    }
  }

  public async resetPassword(userId: string, token: String, password: string) {
    try {
      const user = await this.user.findById(userId);

      if (!user) {
        throw new Error("User not found !");
      }

      if (password && user.local.passwordToken === token) {
        if (moment() < moment(user.local.passwordTokenExpiration)) {
          user.local.password = password;
          user.local.passwordToken = null;
          user.local.passwordTokenExpiration = null;
          await user.save();
          return user;
        } else {
          throw new Error("Token expired !");
        }
      } else throw new Error("Token does not match !");
    } catch (e: any) {
      throw new Error("Something went wrong with resetPassword");
    }
  }
}

export default EmailService;
