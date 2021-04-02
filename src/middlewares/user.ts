import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../entities/User";

export const user = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return next();

    const { username }: any = verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ username });
    res.locals.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
