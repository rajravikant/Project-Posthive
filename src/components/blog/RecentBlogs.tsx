import { usePostRecentQuery } from "@/api/use-posts";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Button from "../ui/Button";
import CustomText from "../ui/CustomText";
import BlogCard from "./BlogCard";

export default function RecentBlogs() {
  const { data: recentPosts, isLoading, isError, error ,refetch} = usePostRecentQuery();
  const router = useRouter();

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center mt-5">
        <CustomText className="text-red-500">
          Error fetching recent blogs: {error.message}
        </CustomText>

        <Button onPress={() => refetch()}>
          <CustomText className="text-white" >
            Retry
          </CustomText>
        </Button>
      </View>
    );
  }
  return (
    <View className="mt-10">
      {isLoading ? (
        <View className="h-[21rem]  bg-gray-300 dark:bg-neutral-950 rounded-lg animate-pulse" />
      ) : (
        <FlashList
          estimatedItemSize={10}
          data={recentPosts}
          keyExtractor={(item) => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <BlogCard
              title={item.title}
              imageUrl={item.imageUrl}
              author={item.creator.username}
              onPress={() =>
                router.navigate({
                  pathname: "/blog/[slug]",
                  params: { slug: item.slug },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}
