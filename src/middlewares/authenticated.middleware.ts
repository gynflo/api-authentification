import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/token";
import User from "../ressources/user/user.model";

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken: JwtPayload | JsonWebTokenError = await verifyToken(
        token
      );
      const user = await User.findById(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("token");
        res.end();
      }
    } catch (e: any) {
      res.clearCookie("token");
      res.end();
    }
  } else next();
}

export default authenticatedMiddleware;
