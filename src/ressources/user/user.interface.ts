import { Document } from "mongoose";

export interface User extends Document {
  _id?: string;
  username: string;
  role: string;
  local: {
    email: string;
    isCheckEmail: boolean;
    emailToken: string;
    password: string;
  };

  isValidPassword(password: string): Promise<boolean | Error>;
}
