export type Creator = {
  _id: string;
  username: string;
  posts: PostType[];
  avatar: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}


export interface PostType {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  tags: string[];
  category: string;
  comments: CommentType[];
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


