import { usePostsQuery } from "@/api/use-posts";
import { BlogCardVertical } from "@/components/blog/BlogCardVertical";
import { SingleBlogSkeleton } from "@/components/blog/BlogSkeleton";
import RecommendedBlogs from "@/components/blog/RecommendedBlogs";
import Filters from "@/components/Filters";
import HomeHeader from "@/components/navigation/HomeHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import CustomText from "@/components/ui/CustomText";
import { categories } from "@/constants/data";
import { Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("");
  const {data, isLoading, isError, isFetching, refetch} = usePostsQuery(filter)
  const {isGuest} = useAuthStore()

  isError && console.error("Error fetching blogs:", isError);

  const blogs = data?.posts || [];


  const refreshPosts = ()=>{
    if(!isLoading) {
      refetch();
    }
  }

  return (
      <ScreenWrapper>
        <HomeHeader />
        <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refreshPosts} />} className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mt-5">
            <CustomText variant="h5" className="text-gray-500 ">
              Your Daily
            </CustomText>
            <CustomText variant="h1" fontFamily={Fonts.SemiBold}>
              Recommendation
            </CustomText>
          </View>

          {/* <Separator/> */}
          {isGuest ? <View>
            <CustomText variant="body" className="text-gray-500 mt-4">
              Please login to see your personalized recommendations.
            </CustomText>
          </View> : <RecommendedBlogs />}

          <View className="my-10">
            <Filters
              filter={filter || "All"}
              setFilter={setFilter}
              selected="All"
              options={categories}
            />

            {isLoading ? (
              <View className="mt-6 flex-1 ">
                {Array.from({length: 6 }).map((_, index) => (
                  <SingleBlogSkeleton key={index} />
                ))}
              </View>
            ) : blogs.length === 0 ? (
              <View className="mt-6">
                <CustomText variant="body" className="text-gray-500">
                  No blogs found
                </CustomText>
              </View>
            ) : (
              <FlashList
                estimatedItemSize={10}
                data={blogs}
                horizontal={false}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="mt-6"
                renderItem={({ item }) => (
                  <BlogCardVertical
                    onPress={() =>
                      router.navigate({
                        pathname: "/blog/[slug]",
                        params: { slug: item.slug },
                      })
                    }
                    {...item}
                  />
                )}
              />
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
  );
}
