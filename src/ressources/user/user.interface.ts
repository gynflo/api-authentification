import { Document } from "mongoose";

export interface User extends Document {
  _id?: string;
  username: string;
  role: string;
  local: {
    email: string;
    emailVerified: boolean;
    emailToken: string;
    password: string;
  };
}
