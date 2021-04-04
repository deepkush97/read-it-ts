import { Request, Response, Router } from "express";
import { getConnection } from "typeorm";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";

import { auth } from "../middlewares/auth";
import { user } from "../middlewares/user";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;
  //Validate
  if (![-1, 0, 1].includes(value)) {
    res.status(400).json({ value: "Value must be -1, 0 or 1." });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;
    if (commentIdentifier) {
      //If there is comment identifier, find vote by comment.
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      console.log(comment);
      vote = await Vote.findOne({ user, comment });
    } else {
      // else, find vote by post
      vote = await Vote.findOne({ user, post });
    }
    if (!vote && value === 0) {
      //if no value and value ===0 return error
      return res.status(404).json({ error: "Vote not found" });
    } else if (!vote) {
      vote = new Vote({ user, value });
      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }
      await vote.save();
    } else if (value === 0) {
      // Vote exists, and value === 0,so remove the vote
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }
    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "sub", "votes"] }
    );
    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const topSubs = async (_: Request, res: Response) => {
  try {
    const imageUrlExpression = `COALESCE('${process.env.APP_URL}/images' || s."imageUrn" ,
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;

    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExpression} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name=p."subName"`)
      .groupBy('s.title, s.name,"imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const miscRoutes = Router();
miscRoutes.post("/vote", user, auth, vote);
miscRoutes.get("/top-subs", topSubs);
