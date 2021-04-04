import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { User } from "../entities/User";
import { auth } from "../middlewares/auth";
import { user } from "../middlewares/user";
import multer, { FileFilterCallback } from "multer";
import { makeId } from "../utils/helpers";
import { ownSub } from "../middlewares/ownSub";
const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name must not be empty";
    if (isEmpty(title)) errors.title = "Title must not be empty";

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: String(name).toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub exists already";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }
  try {
    const sub = new Sub({ name, description, title, user });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;
    if (res.locals.user) {
      sub.posts.forEach((p) => p.setUserVote(res.locals.user));
    }
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ sub: "Sub not found" });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      callback(new Error("Not an image"));
    }
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    if (type !== "image" && type !== "banner") {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid Type" });
    }
    let oldImageUrn: string = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = req.file.filename;
    } else {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file.filename;
    }
    await sub.save();
    if (oldImageUrn !== "") {
      fs.unlinkSync(`public/images/${oldImageUrn}`);
    }
    return res.json(sub);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const searchSubs = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (isEmpty(name)) {
      return res.status(400).json({ error: "Name must not be empty" });
    }
    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where("LOWER(name) LIKE :name", {
        name: `${name.toLowerCase().trim()}%`,
      })
      .getMany();
    return res.json(subs);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const subRoutes = Router();
subRoutes.post("/", user, auth, createSub);
subRoutes.get("/:name", user, getSub);
subRoutes.get("/search/:name", searchSubs);
subRoutes.post(
  "/:name/image",
  user,
  auth,
  ownSub,
  upload.single("file"),
  uploadSubImage
);
