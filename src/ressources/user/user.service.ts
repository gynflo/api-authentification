import UserModel from "./user.model";
import { createToken } from "../../utils/token";
import {v4 as uuid} from 'uuid'

class UserService {
  private user = UserModel;

  public async register(
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const user = await this.user.create({
        username,
        role,
        local: {
          email,
          password,
          isCheckEmail : false,
          emailToken: uuid()
        },
      });
      const accessToken = createToken(user);
      return accessToken;
    } catch (e) {
      throw new Error("Unable to create user");
    }
  }
}

export default UserService;
