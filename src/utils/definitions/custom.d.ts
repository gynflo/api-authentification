import User from "../../ressources/user/user.interface";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
