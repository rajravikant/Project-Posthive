import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { followAuthor, unfollowAuthor } from "./auth";
import { addComment, addPost, deleteComment, deletePost, editComment, editPost, getPaginatedPosts, getPostsByCategory, getRecentPosts, getRecommendedPosts, likePost, unlikePost } from "./blog";

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

export function useRecommendedPostsQuery() {
  return useQuery({
    queryKey: ["blogs", "recommendations"],
    queryFn: () => getRecommendedPosts(),
    refetchInterval : 1000 * 60 * 5
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

export function useLikePostMutation() {
  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
  });
}

export function useUnlikePostMutation() {
  return useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
  });
}


export const useFollowAuthorMutation = (username: string,currentUsername : string) => {
  const queryClient = useQueryClient();
  return useMutation({
        mutationFn: (userId: string) => followAuthor(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
            // Also invalidate the current user's profile to update their following list
            queryClient.invalidateQueries({ queryKey: ["userProfile", currentUsername] });
        },
        // onError: (error) => {
        //     Alert.alert("Error", "Failed to follow user. Please try again.");
        //     console.error("Follow error:", error);
        // }
    });
}


export const useUnfollowAuthorMutation = (username: string, currentUsername:string) => {
  const queryClient = useQueryClient();

  return useMutation({
        mutationFn: (userId: string) => unfollowAuthor(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
            queryClient.invalidateQueries({ queryKey: ["userProfile", currentUsername] });
        }
    });
}
  