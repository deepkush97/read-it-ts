import { compare } from "bcrypt";
import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { sign, verify } from "jsonwebtoken";
import cookie from "cookie";

import { User } from "../entities/User";
import { auth } from "../middlewares/auth";
import { Post } from "../entities/Post";
const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  const user = res.locals.user;
  if (title.trim() === "") {
    return res.status(400).json({ title: "Title must not be empty." });
  }
  try {
    const post = new Post({ title, body, user, subName: sub });
    await post.save();

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const postRoutes = Router();
postRoutes.post("/", auth, createPost);
