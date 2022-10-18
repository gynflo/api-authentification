import {
  sign,
  Secret,
  verify,
  JwtPayload,
} from "jsonwebtoken";
import { User } from "../ressources/user/user.interface";
import { key, keyPub } from "../env/index";

export function createToken(user: User): string {
  return sign({}, key as Secret, {
    subject: user._id!.toString(),
    expiresIn: "1d",
    algorithm: "RS256",
  });
}

export const verifyToken = async (
  token: string
): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    verify(token, keyPub as Secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as JwtPayload);
    });
  });
};
