import { Creator } from "./user";


export interface PostType {
 _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  comments: CommentType[];
  likes: LikeType[];
  views: number;
  creator : Creator
  updatedAt: string;
  createdAt: string;
}


export type CommentType = {
  _id: string;
  text: string;
  creator : Creator
  createdAt: string;
  updatedAt: string;
  post : string
}

export type LikeType = {
  _id: string;
  creator: string;
  post: string;
  createdAt: string;
  updatedAt: string;
}



