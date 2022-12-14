import UserModel from "./user.model";
import { createToken, verifyToken } from "../../utils/token";
import { v4 as uuid } from "uuid";

interface User {
  _id?: string;
  username: string;
  role: string;
  local: {
    email: string;
    password: string;
    isCheckEmail: boolean;
    emailToken: string;
  };
}

class UserService {
  private user = UserModel;

  public async register(
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<User> {
    try {
      const user = await this.user.create({
        username,
        role,
        local: {
          email,
          password,
          isCheckEmail: false,
          emailToken: uuid(),
        },
      });
      createToken(user);
      return user;
    } catch (e) {
      throw new Error("Unable to create user");
    }
  }

  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ "local.email": email });
      if (!user) {
        throw new Error(`Unable to find user with that email Address`);
      }
      //test
      console.log("isValidPassword", await user.isValidPassword(password));
      // fin test

      if (await user.isValidPassword(password)) {
        return createToken(user);
      } else {
        throw new Error(`Wrong Credentials`);
      }
    } catch (e) {
      throw new Error("Something went wrong with login !");
    }
  }

  public async getUserByToken(token: string) {
    try {
      const payload = await verifyToken(token);
      if (payload.sub) {
        const user = await this.user
          .findById(payload.sub)
          .select("-local.password -__v");
        return user;
      }
    } catch (e) {
      throw new Error(`User unknown`);
    }
  }
}

export default UserService;
