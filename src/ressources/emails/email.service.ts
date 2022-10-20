import UserModel from "../user/user.model";

class EmailService {
  private user = UserModel;

  public async verificationEmail(userId: string, token: string) {
    try {
      const user = await this.user.findById(userId);

      if (user && token && token === user.local.emailToken) {
        user.local.isCheckEmail = true;
        await user.save();
        return user;
      } else {
        throw new Error("Problem during email verification");
      }
    } catch (e: any) {
      throw new Error("Problem during email verification");
    }
  }
}

export default EmailService;
