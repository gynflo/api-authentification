import { sign, Secret, verify, JwtPayload } from "jsonwebtoken";
import { User } from "../ressources/user/user.interface";
import { key, keyPub } from "../env/index";

export function createToken(user: User): string {
  return sign({}, key as Secret, {
    subject: user._id!.toString(),
    expiresIn: "1d",
    algorithm: "RS256",
  });
}

export function verifyToken(token: string): JwtPayload | string {
  return verify(token, keyPub);
}
