import { compare } from "bcrypt";
import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { sign, verify } from "jsonwebtoken";
import cookie from "cookie";

import { User } from "../entities/User";
import { auth } from "../middlewares/auth";
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    // Validate data
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    const user = new User({ email, password, username });

    if (emailUser) errors.email = "Email is already taken";
    if (usernameUser) errors.username = "Username is already taken";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json({ errors });
    // Create a User
    await user.save();
    return res.json(user);
    // Return the user
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Validate data
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Username must not be empty";
    if (isEmpty(password)) errors.password = "Password must not be empty";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches)
      return res.status(401).json({ password: "Password is incorrect" });

    const token = sign({ username }, process.env.JWT_SECRET);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = async (_: Request, res: Response) => {
  try {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }
};

export const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", auth, me);
authRouter.get("/logout", auth, logout);
