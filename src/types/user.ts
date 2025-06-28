import { Creator } from "./post";

export type User = {
    currentUser: Creator | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface UpdateUserBody {
    username?: string;
    email?: string;
    password?: string;
    avatar?: File | null;
}


export interface UpdateUserResponse {
    updatedUser: Creator;
    message: string;
}
