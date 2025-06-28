import { CommentType, PostType } from "@/types/post";
import { axiosPrivate, axiosPublic } from "@/utils/axios";
import { AxiosResponse } from "axios";


interface GetPostResponse {
    posts: PostType[];
    totalPosts:number  // total number of pages
}

export const getPosts = async ():Promise<GetPostResponse> => {
      const response = await axiosPublic.get("posts")
      return response.data
}

export const getPost = async (slug:string):Promise<PostType> => {
    const response = await axiosPublic.get(`posts?slug=${slug}`)
    return response.data.posts[0]
}

export const getRecentPosts = async ():Promise<PostType[]> => {
    const response = await axiosPublic.get("posts?sortBy=recent")
    return response.data.posts
}


export const getPaginatedPosts = async (category:string, sortBy:"recent" | "oldest" = "recent", searchTerm:string = "",page:number = 1) => {
    let ct = category === "all" ? "" : category
    let sb = sortBy === "recent" ? "desc" : "asc"
    const  response = await axiosPublic.get(`posts?startIndex=${page}&category=${ct}&direction=${sb}&searchTerm=${searchTerm}`)
    
    const fetchedPosts = response.data.posts as PostType[]
    const nextPage = response.data.totalPosts > page ? page + 1 : null

    return {
        posts: fetchedPosts,
        nextPage
    }
}

export const getPostsByCategory = async (category:string):Promise<GetPostResponse> => {
    let ct = category === "all" ? "" : category.toLowerCase()
    const response = await axiosPublic.get(`posts?category=${ct}`)
    return response.data
} 


export interface AddPostResponse {
    message: string;
    post: PostType;
}

export const addPost = async (formData: FormData):Promise<AxiosResponse<AddPostResponse>>  => {
    const response = await axiosPrivate.post("posts/create",formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    return response
}

export const editPost = async (postId: string, formData: FormData):Promise<PostType> => {
    const response = await axiosPrivate.patch(`posts/${postId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const deletePost = async (postId: string) => {
    const response = await axiosPrivate.delete(`posts/${postId}`)
    return response.data
}

export const addComment = async (postId: string, commentText: string):Promise<CommentType> => {
    const response =  await axiosPrivate.post(`comment/${postId}`, { text: commentText });
    return response.data.comment;
}


export const deleteComment = async (commentId: string) => {
    const response = await axiosPrivate.delete(`comment/${commentId}`);
    return response;
}

export const editComment = async (commentId: string, text: string):Promise<CommentType> => {
    const response = await axiosPrivate.patch(`comment/${commentId}`, { text });
    return response.data;
}

