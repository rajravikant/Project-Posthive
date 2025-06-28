import { getUserProfile } from "@/api/auth";
import { useDeletePostMutation } from "@/api/use-posts";
import { BlogCardVertical } from "@/components/blog/BlogCardVertical";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import Icon from "@/components/ui/Icon";
import useAuthStore from "@/store/authStore";
import { PostType } from "@/types/post";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function UserBlogs() {
  // const {currentUser} = useLocalSearchParams()
  const { currentUser } = useAuthStore();
  const client = useQueryClient();

  const router = useRouter();
  const {
    data: user,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", currentUser?.username],
    queryFn: () => getUserProfile(currentUser?.username!),
  });

  const deleteMutation = useDeletePostMutation();

  const deletedHandler = (postId: string) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutation.mutate(postId, {
            onSuccess: () => {
              client.invalidateQueries();
            },
            onError: (error) => {
              Alert.alert("Error", error.message);
            },
          });
        },
      },
    ]);
  };

  const onEditHandler = (postId: string) => {
    const item = user?.posts.find((post) => post._id === postId);
    if (!item) {
      Alert.alert("Error", "Post not found");
      return;
    }

    router.push({
      pathname: "/blog/edit",
      params: {
        postId: item._id,
        title: item.title,
        content: item.content,
        category: item.category,
        image: item.imageUrl,
        tags: item.tags,
        summary: item.summary,
      },
    });
  };

  if (isLoading) {
    return <BlogSkeleton />;
  }

  if (isError) {
    return <CustomText className="text-red-500">{error.message}</CustomText>;
  }

  if (!user) {
    return <CustomText className="text-gray-500">User not found</CustomText>;
  }

  const isAuthor = currentUser?.username.trim() === user.username.trim();

  return (
    <ScreenWrapper>
      <View>
        <CustomText variant="h1" className="mb-4">
          Your Blogs
        </CustomText>
      </View>
      {user.posts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Icon
            name="sticky-note"
            family="FontAwesome5"
            size={50}
            color="#999"
          />
          <CustomText variant="h5" className="mt-4 text-gray-500">
            No blogs yet
          </CustomText>
          <CustomText variant="body" className="text-gray-400 text-center mt-2">
            You haven't written any blogs yet. Start writing your first blog
            now!
          </CustomText>

          <Button className="mt-5" variant="secondary" onPress={() => router.push("/addpost")}>
            Write a Blog
          </Button>
        </View>
      ) : (
        <FlashList
          data={user?.posts}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              isAuthor={isAuthor}
              onDelete={deletedHandler}
              onEdit={onEditHandler}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          stickyHeaderHiddenOnScroll={true}
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
        />
      )}
    </ScreenWrapper>
  );
}

interface ListItemProps {
  item: PostType;
  isAuthor: boolean;
  onDelete: (postId: string) => void;
  onEdit: (postId: string) => void;
}

const ListItem = ({ item, isAuthor, onDelete, onEdit }: ListItemProps) => {
  const router = useRouter();
  const {colorScheme} = useColorScheme()
  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 50 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <View>
          <TouchableOpacity
            style={{ width: 50, height: 50 }}
          activeOpacity={0.7}
            onPress={() => onDelete(item._id)}
            className=" justify-center items-center"
          >
            <Icon name="trash" family="Ionicons" size={20} color={colorScheme === "dark" ? "#5f5f5f" : "black"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: 50, height: 50 }}
            onPress={() => onEdit(item._id)}
            className=" justify-center items-center"
          >
            <Icon name="pencil" family="Ionicons" size={20} color={colorScheme === "dark" ? "#5f5f5f" : "black"} />
          </TouchableOpacity>
        </View>
      </Reanimated.View>
    );
  }
  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture={true}
      rightThreshold={40}
      renderRightActions={RightAction}
    >
      <View style={{ marginTop: 10 }}>
        <BlogCardVertical
          {...item}
          isAuthor={isAuthor}
          onPress={() => router.push(`/blog/${item.slug}`)}
        />
      </View>
    </ReanimatedSwipeable>
  );
};
