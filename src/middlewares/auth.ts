import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../entities/User";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("Unauthenticated");

    const { username }: any = verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ username });
    if (!user) throw new Error("Unauthenticated");
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
