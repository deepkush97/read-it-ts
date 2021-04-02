export interface Post {
  identifier: string;
  title: string;
  slug: string;
  body?: string;
  subName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  //Virtual fields
  url: string;
  voteScore?: number;
  userVote?: number;
  commentCount?: number;
}

export interface User {
  username: string;
  email: string;
  createAt: string;
  updatedAt: string;
}
