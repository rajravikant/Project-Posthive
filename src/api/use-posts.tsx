import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { addComment, addPost, deleteComment, deletePost, editComment, editPost, getPaginatedPosts, getPostsByCategory, getRecentPosts } from "./blog";

export function usePostsQuery(filter: string) {
  return useQuery({
    queryKey: ["blogs", filter],
    queryFn: () => getPostsByCategory(filter.toLowerCase()),
  });
}

export function usePostRecentQuery() {
  return useQuery({
    queryKey: ["blogs", "recent"],
    queryFn: () => getRecentPosts(),
  });
}

export function usePaginatedPostsQuery(
  searchQuery: string,
  selectedCategory: string,
  sortBy: "recent" | "oldest"
) {
  return useInfiniteQuery({
    queryKey: ["blogs", searchQuery, selectedCategory, sortBy],
    queryFn: ({ pageParam }) =>
      getPaginatedPosts(
        selectedCategory.toLowerCase(),
        sortBy,
        searchQuery,
        pageParam
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}


export function usePostMutation(){
    return useMutation({
        mutationFn : (formData: FormData) => addPost(formData)
    })
}


export function useEditPostMutation() {
  return useMutation({
    mutationFn: ({ postId, formData }: { postId: string; formData: FormData }) =>
      editPost(postId, formData),
  });
}

export function useDeletePostMutation() {
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
  });
}

export function useAddComment() {
  return useMutation({
    mutationFn: (data: { comment: string; postId: string }) => addComment(data.postId, data.comment)
    
  });
}


export function useEditComment(){
  return useMutation({
    mutationFn: (data: { comment: string; commentId: string }) => editComment(data.commentId, data.comment),
  });
}


export function useDeleteCommentMutation() {
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId)
  });
}

