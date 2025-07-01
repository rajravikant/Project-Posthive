import { updatePostViewed } from "@/api/auth";
import { getPost } from "@/api/blog";
import {
  useAddComment,
  useDeleteCommentMutation,
  useEditComment,
  useLikePostMutation,
  useUnlikePostMutation,
} from "@/api/use-posts";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";
import RichBlogContent from "@/components/blog/RichBlogContent";
import ScreenHeader from "@/components/navigation/ScreenHeader";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import Icon from "@/components/ui/Icon";
import Separator from "@/components/ui/Separator";
import { Colors, Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { CommentType } from "@/types/post";
import { Feather } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate, formatDistance } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const HEADER_HEIGHT = 350;

export default function Blog() {
  const { slug } = useLocalSearchParams();
  const { addToBookmark, userBookmarks, removeFromBookmark, currentUser } = useAuthStore();
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [editingComment, setEditingComment] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const {
    data: blog,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getPost(slug as string),
  });
  // const [isLiked, setIsLiked] = useState<boolean>(() => {
  //   if (!blog) return false;
  //   return (
  //     blog.likes.filter((like: LikeType) => like.creator === currentUser?.userId)
  //       .length > 0 || false
  //   );
  // });
  const isLiked = blog?.likes.some(like => like.creator === currentUser?.userId)
  useEffect(() => {
    if (blog && blog.comments) {
      setComments(
        blog.comments.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );

      if (currentUser && scrollY.value > 100) {
        updateUserViewed();
      }
    }
  }, [blog]);

  const add = useAddComment();
  const edit = useEditComment();
  const deleteComment = useDeleteCommentMutation();
  const likePost = useLikePostMutation();
  const unlikePost = useUnlikePostMutation();

  const { colorScheme } = useColorScheme();
  const { width: windowWidth } = Dimensions.get("window");

  const filterSheetRef = useRef<BottomSheet | null>(null);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Use this approach for smoother updates
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    // Create a more linear and smooth translation
    // Use a simple dampening factor for better physics feel
    const translateY = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      [HEADER_HEIGHT / 4, 0, -HEADER_HEIGHT / 3, -HEADER_HEIGHT / 2],
      "clamp"
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  const toggleLike = () => {
    if (!blog) return;

    if (!currentUser) {
      Alert.alert("You must be logged in to like a post");
      return;
    }

    if (isLiked) {
      unlikePost.mutate(blog._id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["blog",blog.slug] });
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } else {
      likePost.mutate(blog._id, {
        onSuccess: ({ like }) => {
          queryClient.invalidateQueries({ queryKey: ["userProfile",blog.slug] });
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }

    
  };

  const onCommentSubmit = async () => {
    if (editingComment) {
      // Update existing comment
      edit.mutate(
        { comment: commentText, commentId: editingComment.id },
        {
          onSuccess: (data) => {
            setComments((prev) =>
              prev.map((comment) =>
                comment._id === editingComment.id
                  ? { ...comment, text: data.text }
                  : comment
              )
            );
            Keyboard.dismiss();
            setCommentText("");
            setEditingComment(null);
            queryClient.invalidateQueries({ queryKey: ["blog", slug] });
            filterSheetRef.current?.close();
          },
          onError: (error) => {
            Alert.alert(
              "Error",
              "Failed to update comment. Please try again later."
            );
            console.error("Error updating comment:", error);
          },
        }
      );
    } else {
      // Add new comment
      add.mutate(
        { comment: commentText, postId: blog?._id as string },
        {
          onSuccess: (data) => {
            setComments((prev) => [data, ...prev]);
            setCommentText("");
            queryClient.invalidateQueries({ queryKey: ["blog", slug] });
            filterSheetRef.current?.close();
          },
          onError: (error) => {
            Alert.alert(
              "Error",
              "Failed to add comment. Please try again later."
            );
            console.error("Error adding comment:", error);
          },
        }
      );
    }
  };

  const onDeleteComment = async (id: string) => {
    deleteComment.mutate(id, {
      onSuccess: () => {
        setComments((prev) => prev.filter((comment) => comment._id !== id));
        queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      },
    });
  };

  // const onEditComment = async (id: string, text: string) => {
  //   edit.mutate(
  //     { comment: text, commentId: id },
  //     {
  //       onSuccess: (data) => {
  //         setComments((prev) =>
  //           prev.map((comment) =>
  //             comment._id === id ? { ...comment, text: data.text } : comment
  //           )
  //         );
  //         queryClient.invalidateQueries({ queryKey: ["blog", slug] });
  //       },
  //       onError: (error) => {
  //         Alert.alert(
  //           "Error",
  //           `Failed to update comment. Please try again later.`
  //         );
  //         console.error("Error updating comment:", error);
  //       },
  //     }
  //   );
  // };

  const toggleBookmark = () => {
    if (!blog) return;
    if (userBookmarks.includes(blog.slug!)) {
      removeFromBookmark(blog.slug!);
    } else {
      addToBookmark(blog.slug!);
    }
  };

  const handleDeleteComment = (id: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDeleteComment(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleEditComment = (id: string, text: string) => {
    setEditingComment({ id, text });
    setCommentText(text);
    filterSheetRef.current?.expand();
  };

  const updateUserViewed = async () => {
    if (!blog) return;
    console.log("Updating post viewed count for blog:");
    
    const response = await updatePostViewed(blog._id);
    if (response.status !== 204) {
      console.log("Error updating post viewed count");
    }
    return queryClient.invalidateQueries({
      queryKey: ["blog", "recommendations"],
    });
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleOpenFilterSheet = useCallback(() => {
    filterSheetRef.current?.expand();
  }, []);

  if (isLoading) {
    return <BlogSkeleton />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <CustomText variant="body" className="text-gray-500">
          Something went wrong
        </CustomText>
      </View>
    );
  }
  return (
    <>
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEventThrottle={16} // Better for 60fps animation
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal" // Smoother deceleration
      >
        <Animated.View
          style={[
            animatedImageStyle,
            {
              position: "relative",
              height: HEADER_HEIGHT,
              width: windowWidth,
              overflow: "hidden",
            },
          ]}
        >
          <ScreenHeader
            onPress={toggleBookmark}
            isBookmarked={userBookmarks.includes(blog?.slug!)}
          />
          <Animated.Image
            source={{ uri: blog?.imageUrl }}
            style={{
              height: HEADER_HEIGHT + 40, // Slightly taller to avoid edges showing during animation
              width: windowWidth,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
            className="object-cover"
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              "transparent",
              colorScheme === "dark" ? "rgba(0, 0, 0, 0.98)" : "#fff",
            ]}
            className="absolute inset-0"
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View className="absolute bottom-10 px-6 gap-3">
              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/userProfile",
                      params: { username: blog?.creator.username },
                    })
                  }
                  className="flex-row items-center"
                >
                  <Avatar uri={blog?.creator.avatar!} className="size-8" />
                  <CustomText variant="body" className="text-gray-800 ms-2">
                    {blog?.creator.username}
                  </CustomText>
                </TouchableOpacity>
                <CustomText>
                  •{" "}
                  {blog?.category.charAt(0).toUpperCase() +
                    blog?.category.slice(1)!}
                </CustomText>
              </View>
              <CustomText variant="h2" className="text-black">
                {blog?.title}
              </CustomText>
              <CustomText variant="body" className="text-gray-800 mt-2">
                {formatDate(blog?.createdAt!, "MMMM dd, yyyy")}
              </CustomText>
              {blog?.tags && blog.tags.length > 0 && (
                <View className="flex-row flex-wrap">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} text={tag} />
                  ))}
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        <View className="flex-grow rounded-t-2xl w-full bg-white  dark:bg-black">
          <View className="p-4">
            <View className="mt-2 gap-2">
              <View className="flex-row justify-between">
                <CustomText
                  variant="h1"
                  className="text-gray-900 dark:text-white"
                >
                  Summary
                </CustomText>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    {currentUser && (
                      <TouchableOpacity onPress={toggleLike}>
                        <Feather name="thumbs-up" size={15} color={isLiked ? Colors.primary : "#555"} />
                      </TouchableOpacity>
                    )}
                    <CustomText>{blog?.likes.length || 0}</CustomText>
                  </View>

                  <CustomText>{blog?.views || 0} Views</CustomText>
                </View>
              </View>
              <CustomText
                variant="h4"
                fontFamily={Fonts.Light}
                className="text-body dark:text-gray-400"
              >
                {blog?.summary}
              </CustomText>
            </View>
            <Separator />

            <RichBlogContent content={blog?.content!} />

            <View className="py-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <CustomText
                    variant="h1"
                    className="text-gray-900 dark:text-white"
                  >
                    Comments ({comments.length || 0})
                  </CustomText>
                  <CustomText
                    variant="body"
                    className="text-gray-500 dark:text-gray-400 mt-1"
                  >
                    Join the conversation
                  </CustomText>
                </View>
                {currentUser && (
                  <Button
                    variant="primary"
                    className="mt-2 px-4"
                    onPress={() => {
                      setEditingComment(null);
                      setCommentText("");
                      handleOpenFilterSheet();
                    }}
                  >
                    <Icon
                      name="chatbubble-outline"
                      family="Ionicons"
                      size={16}
                      color="#fff"
                      className="mr-1"
                    />
                    <CustomText className="text-white">Comment</CustomText>
                  </Button>
                )}
              </View>

              <View className="mt-6">
                {currentUser ? (
                  <>
                    {comments && comments.length > 0 ? (
                      <View className="mt-2">
                        <FlashList
                          estimatedItemSize={100}
                          data={comments}
                          renderItem={({ item }) => (
                            <CommentItem
                              comment={item}
                              isCreator={item.creator._id === currentUser.userId}
                              onDelete={handleDeleteComment}
                              onEdit={handleEditComment}
                            />
                          )}
                          keyExtractor={(item) => item._id}
                        />
                      </View>
                    ) : (
                      <View className="items-center py-8 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                        <Icon
                          name="chatbubble-ellipses-outline"
                          family="Ionicons"
                          size={40}
                          color={colorScheme === "dark" ? "#666" : "#aaa"}
                        />
                        <CustomText
                          variant="h5"
                          className="text-gray-500 dark:text-gray-400 mt-3"
                        >
                          No comments yet
                        </CustomText>
                        <CustomText
                          variant="body"
                          className="text-gray-400 dark:text-gray-500 text-center mt-1 max-w-xs"
                        >
                          Be the first to share your thoughts on this post!
                        </CustomText>
                      </View>
                    )}
                  </>
                ) : (
                  <View className="items-center py-8 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <Icon
                      name="lock-closed-outline"
                      family="Ionicons"
                      size={40}
                      color={colorScheme === "dark" ? "#666" : "#aaa"}
                    />
                    <CustomText
                      variant="h5"
                      className="text-gray-500 dark:text-gray-400 mt-3"
                    >
                      Sign in to join the conversation
                    </CustomText>
                    <CustomText
                      variant="body"
                      className="text-gray-400 dark:text-gray-500 text-center mt-1"
                    >
                      Please log in to view and add comments.
                    </CustomText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <BottomSheet
        ref={filterSheetRef}
        index={-1}
        snapPoints={["30%"]}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#202020" : "#ffffff",
        }}
        onClose={() => {
          if (editingComment) {
            setEditingComment(null);
            setCommentText("");
          }
        }}
      >
        <BottomSheetView className="flex-1">
          <View className="flex-row items-center justify-between px-4 py-2">
            <CustomText variant="h3" className="text-gray-900 dark:text-white">
              {editingComment ? "Edit Comment" : "Add a Comment"}
            </CustomText>
            <View className="flex-row">
              {editingComment && (
                <Button
                  variant="outline"
                  onPress={() => {
                    setEditingComment(null);
                    setCommentText("");
                    filterSheetRef.current?.close();
                  }}
                  className="mr-2"
                >
                  <CustomText>Cancel</CustomText>
                </Button>
              )}
              <Button
                variant="primary"
                onPress={onCommentSubmit}
                disabled={!commentText.trim()}
                loading={editingComment ? edit.isPending : add.isPending}
              >
                <CustomText className="text-white">
                  {editingComment ? "Update" : "Submit"}
                </CustomText>
              </Button>
            </View>
          </View>
          <Separator />
          <BottomSheetTextInput
            value={commentText}
            onChangeText={setCommentText}
            className="self-stretch mx-4 mb-4 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-4 dark:text-white"
            placeholder="Write your comment here..."
            placeholderTextColor={colorScheme === "dark" ? "#666" : "#aaa"}
            multiline
            style={{ minHeight: 80 }}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

interface CommentItemProps {
  comment: CommentType;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  isCreator: boolean;
}

const CommentItem = ({
  comment,
  isCreator,
  onDelete,
  onEdit,
}: CommentItemProps) => {
  return (
    <View className="p-4 bg-white dark:bg-neutral-800 rounded-lg mb-4 border border-gray-100 dark:border-neutral-700 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {/* Profile image placeholder - can be replaced with actual avatar component */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/userProfile",
                params: { username: comment.creator.username },
              })
            }
            className="w-8 h-8 rounded-full bg-blue-500 mr-2 items-center justify-center"
          >
            <Avatar uri={comment.creator.avatar} className="size-8" />
          </TouchableOpacity>
          <CustomText variant="h5" className="text-gray-900 dark:text-white">
            {comment.creator.username}
          </CustomText>
        </View>

        {isCreator && (
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => onEdit(comment._id, comment.text)}
              className="p-2 mr-2"
            >
              <Icon name="pencil" family="Ionicons" size={16} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(comment._id)}
              className="p-2"
            >
              <Icon
                name="trash-outline"
                family="Ionicons"
                size={16}
                color="#ef4444"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <CustomText
        variant="body"
        className="text-gray-600 dark:text-gray-300 mt-3 mb-2"
      >
        {comment.text}
      </CustomText>

      <View className="flex-row items-center mt-1">
        <Icon name="time-outline" family="Ionicons" size={14} color="#9ca3af" />
        <CustomText variant="body" className="text-gray-400 ml-1 text-xs">
          {formatDistance(new Date(comment.createdAt), new Date(), {
            addSuffix: true,
          })}
        </CustomText>
      </View>
    </View>
  );
};
