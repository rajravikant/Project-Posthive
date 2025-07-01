import { PostType } from "./post";

export type Creator = {
  _id: string;
  username: string;
  posts: PostType[];
  avatar: string;
  email: string;
  bio: string;
  likedPosts: LikedPosts[];
  viewedPosts:string[];
  followers: FollowFollower[];
  following: FollowFollower[];
  createdAt: string;
  updatedAt: string;
}





export type LikedPosts = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
}


export interface FollowFollower {
  _id: string;
  username: string;
  avatar: string;
}

export type User = {
    currentUser: { userId: string; username: string, avatar: string } | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface UpdateUserBody {
    username?: string;
    email?: string;
    password?: string;
    bio?: string;
    avatar?: File | null;
}


export interface UpdateUserResponse {
    updatedUser: Creator;
    message: string;
}

export interface UserProfileResponse {
     _id: string;
      username: string;
      avatar: string;
      email: string;
      bio: string;
      posts: PostType[];
      likedPosts: LikedPosts[];
      followers: FollowFollower[];
      following: FollowFollower[];
      viewedPosts: string[];
      createdAt: string;
      updatedAt: string;
}