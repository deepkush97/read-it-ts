export interface Post {
  identifier: string;
  title: string;
  slug: string;
  body?: string;
  subName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  sub?: Sub;
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
export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  //Virtual fields
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}

export interface Comment {
  identifier: string;
  body: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  post?: Post;
  //Virtual fields
  voteScore: number;
  userVote: number;
}
