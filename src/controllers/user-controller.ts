import bcrypt from "bcrypt";
import Joi from "joi";
import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";
import AppError from "../utilities/app_errores";
import UsersModels, { UserType } from "../modules/user-module";
import jwt from "jsonwebtoken";
import("dotenv/config");
import _ from "lodash";
import { decodeType } from "../middlewares/auth";

export const register = tryCatchHandler<
  Request<{}, {}, { name: string; email: string; password: string }>,
  Response<{
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>
>(
  async (
    req: Request<{}, {}, { name: string; email: string; password: string }>,
    res: Response<{
      message: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>
  ) => {
    const schema = {
      name: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    };
    const validateResult = Joi.object(schema).validate(req.body);

    if (validateResult.error) {
      throw new AppError(101, 400, validateResult.error.details[0].message);
      // return res.status(404).send(validateResult.error.details[0].message);
    }
    const { name, email, password } = req.body;
    const isEmail = await UsersModels.getUsersByEmail(email);

    if (isEmail.length) throw new AppError(101, 400, "email already hass benn");

    const hashPassword = await bcrypt.hash(password, 10);
    await UsersModels.insertUser(name, email, hashPassword);
    const newUserArray = await UsersModels.getUsersByEmail(email);
    const newUser = newUserArray[0];
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(201).json({
      message: "welcome ",
      user: _.pick(newUser, ["id", "name", "email"]),
    });
  }
);

export const login = tryCatchHandler<
  Request<{}, {}, { email: string; password: string }>,
  Response<{
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>
>(
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response<{
      message: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>
  ) => {
    const schema = {
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    };
    const validateResult = Joi.object(schema).validate(req.body);

    if (validateResult.error) {
      throw new AppError(101, 400, validateResult.error.details[0].message);
    }
    const { email, password } = req.body;
    const validateByEmailArray = await UsersModels.getUsersByEmail(email);
    const validateByEmail = validateByEmailArray[0];
    if (!validateByEmail) {
      throw new AppError(101, 400, "email or passworld in invalidate");
    }
    const validatePassword = await bcrypt.compare(
      password,
      validateByEmail.password
    );
    if (!validatePassword)
      throw new AppError(101, 400, "email or passworld in invalidate");

    const accessToken = generateAccessToken(validateByEmail);
    const refreshToken = generateRefreshToken(validateByEmail);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(201).json({
      message: "welcome ",
      user: _.pick(validateByEmail, ["id", "name", "email"]),
    });
  }
);

export const getUser = tryCatchHandler<
  Request,
  Response<{
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>
>(
  async (
    req: Request,
    res: Response<{
      message: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>
  ) => {
    const cookieAccessToken = req.cookies.accessToken;
    const cookieRefreshToken = req.cookies.refreshToken;

    if (!cookieAccessToken) {
      throw new AppError(1100, 401, "Access denied");
    }
    if (!cookieRefreshToken) throw new AppError(1100, 401, "Refresh denied");
    try {
      const decode = jwt.verify(
        cookieAccessToken,
        process.env.ACCESS_TOKEN_SECRET || ""
      ) as decodeType;

      const userArray = await UsersModels.getUsersById(decode.id);
      const user = userArray[0];
      if (!user) throw new Error("User not found");
      res.status(200).json({
        message: "welcome",
        user,
      });
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
            const userArray = await UsersModels.getUsersById(decode.id);
            const user = userArray[0];
            if (!user) throw new Error("User not found");
            res.status(200).json({
              message: "welcome",
              user,
            });
          } catch (error) {
            throw new AppError(1100, 401, "refresh token is invalid");
          }
        } else {
          throw new AppError(1100, 401, "token is invalid");
        }
      }
    }
  }
);

export const logout = (_req: Request, res: Response): void => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error });
  }
};

function generateAccessToken(user: UserType): string {
  return jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET || "your_access",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
}
function generateRefreshToken(user: UserType): string {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET || "your_refresh",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
}
