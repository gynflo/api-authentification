import { sign, Secret } from "jsonwebtoken";
import { User } from "../ressources/user/user.interface";

export function createToken(user: User): string {
  return sign({ id: user._id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "1d",
  });
}
