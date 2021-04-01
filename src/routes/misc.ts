import { Request, Response, Router } from "express";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
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

export const miscRoutes = Router();
miscRoutes.post("/vote", user, auth, vote);
