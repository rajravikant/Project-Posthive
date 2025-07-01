import { useRecommendedPostsQuery } from "@/api/use-posts";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Button from "../ui/Button";
import CustomText from "../ui/CustomText";
import BlogCard from "./BlogCard";

export default function RecommendedBlogs() {
  const {
    data: recommendedPosts,
    isLoading,
    isError,
    error,
    refetch,
  } = useRecommendedPostsQuery();
  const router = useRouter();

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center mt-5">
        <CustomText className="text-red-500">
          Error fetching recommended blogs: {error.message}
        </CustomText>

        <Button variant="secondary" onPress={() => refetch()}>
        Retry
        </Button>
      </View>
    );
  }
  return (
    <View className="mt-10 flex-1 ">
      {isLoading ? (
        <View className="h-[21rem]  bg-gray-200 dark:bg-neutral-950 rounded-lg animate-pulse" />
      ) : (
       recommendedPosts && recommendedPosts.length > 0 ? (
         <FlashList
          estimatedItemSize={10}
          data={recommendedPosts || []}
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
      ): (
        <View className="items-center justify-center mt-5 gap-3">
          <CustomText className="text-gray-500 dark:text-gray-300">
            No recommended blogs available.
          </CustomText>
          <Button  onPress={() => refetch()}>
           Retry
          </Button>
        </View>
      )
      )
    
    
    }
    </View>
  );
}
