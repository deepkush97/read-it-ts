import { NextFunction, Request, Response } from "express";
import { Sub } from "../entities/Sub";
import { User } from "../entities/User";

export const ownSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });
    if (sub.username !== user.username) {
      return res.status(403).json({ error: "You don't own this sub" });
    }
    res.locals.sub = sub;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
