import "dotenv/config";
import { NextFunction, Request, Response } from "express-serve-static-core";
import AppError from "../utilities/app_errores";
import jwt from "jsonwebtoken";
export type decodeType = { id: string };
function auth(req: Request, res: Response, next: NextFunction): void {
  const cookieAccessToken = req.cookies.accessToken;
  const cookieRefreshToken = req.cookies.refreshToken;
 
  if (!cookieAccessToken) {
    throw new AppError(1100, 401, "Access denied");
  }
  if (!cookieRefreshToken) throw new AppError(1100, 401, "Refresh denied");
  
  try {
     jwt.verify(
      cookieAccessToken,
      process.env.ACCESS_TOKEN_SECRET || ""
    ) as decodeType;
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decode: decodeType = jwt.verify(
            cookieRefreshToken,
            process.env.REFRESH_TOKEN_SECRET || ""
          ) as decodeType;
          const newAccessToken = jwt.sign(
            { id: decode.id },
            process.env.ACCESS_TOKEN_SECRET || "",
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
          );
          const newRefresgToken = jwt.sign(
            { id: decode.id },
            process.env.REFRESH_TOKEN_SECRET || "",
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
          );
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
          });
          res.cookie("refreshToken", newRefresgToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
          });
          res.status(200).send("access token and refresh token updated");
        } catch (error) {
          throw new AppError(1100, 401, "refresh token is invalid");
        }
      } else {
        throw new AppError(1100, 401, "token is invalid");
      }
    }
  }
}

export default auth;
