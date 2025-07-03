import { usePaginatedPostsQuery } from "@/api/use-posts";
import ScreenWrapper from "@/components/ScreenWrapper";
import { BlogCardVertical } from "@/components/blog/BlogCardVertical";
import { SingleBlogSkeleton } from "@/components/blog/BlogSkeleton";
import CustomText from "@/components/ui/CustomText";
import Icon from "@/components/ui/Icon";
import InputField from "@/components/ui/InputField";
import { categories } from "@/constants/data";
import { Colors } from "@/constants/theme";
import { useDebounce } from "@/hooks/useDebounce";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");
  const filterSheetRef = useRef<BottomSheet | null>(null);
  const { colorScheme } = useColorScheme();

  const {
    data,
    isError,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    refetch,
  } = usePaginatedPostsQuery(debouncedSearchQuery, selectedCategory, sortBy);

  const blogs = data?.pages.flatMap((page) => page.posts);

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

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <CustomText variant="h5" className="text-red-500">
          Error loading blogs
        </CustomText>
        <CustomText variant="body" className="text-gray-500">
          {error.message}
        </CustomText>
      </View>
    );
  }

  const InfiniteScroll = () => {
    if (!hasNextPage)
      return (
        <CustomText variant="body" className="text-gray-500 text-center">
          No more results
        </CustomText>
      );

    if (isFetchingNextPage) {
      return (
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={{ marginVertical: 20 }}
        />
      );
    }
    return null;
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Search Header */}
        <View className="mt-4">
          {/* Search Input */}
          <InputField
            placeholder="Search for blogs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={{
              name: "search",
              family: "Ionicons",
              size: 20,
            }}
            containerClassName="mb-4"
          />
          {/* Filter and Sort Controls */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <CustomText variant="body" className="mr-2">
                {selectedCategory}
              </CustomText>
              <Icon
                name="chevron-down"
                family="Ionicons"
                size={16}
                color="#666666"
              />
            </View>

            <TouchableOpacity
              className="flex-row items-center bg-gray-100 dark:bg-neutral-800 px-3 py-2 rounded-lg"
              onPress={handleOpenFilterSheet}
            >
              <Icon
                name="funnel-outline"
                family="Ionicons"
                size={16}
                color="#666666"
              />
              <CustomText variant="body" className="ml-2">
                Filter & Sort
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Results Count */}
          <CustomText
            variant="body"
            className="text-gray-500 dark:text-gray-400 mb-2"
          >
            {blogs?.length} {blogs?.length === 1 ? "result" : "results"} found
          </CustomText>
        </View>

        {isLoading ? (
          <View>
            {Array.from({ length: 6 }).map((_, index) => (
              <SingleBlogSkeleton key={index} />
            ))}
          </View>
        ) : blogs && blogs.length > 0 ? (
          <FlashList
            data={blogs}
            estimatedItemSize={6}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-20"
            renderItem={({ item }) => (
              <BlogCardVertical
                {...item}
                onPress={() =>
                  router.navigate({
                    pathname: "/blog/[slug]",
                    params: { slug: item.slug },
                  })
                }
              />
            )}
            ListFooterComponent={InfiniteScroll}
            onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
            refreshing={isLoading}
            onRefresh={() => refetch()}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Icon name="search" family="Ionicons" size={50} color="#999" />
            <CustomText variant="h5" className="mt-4 text-gray-500">
              No blogs found
            </CustomText>
            <CustomText
              variant="body"
              className="text-gray-400 text-center mt-2"
            >
              Try adjusting your search or filter settings
            </CustomText>
          </View>
        )}
      </View>
      <BottomSheet
        ref={filterSheetRef}
        index={-1}
        snapPoints={["45%"]}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#202020" : "#ffffff",
        }}
      >
        <BottomSheetView className="flex-1">
          <View className="h-full  p-4 justify-between">
            {/* Categories Section */}
            <View className="mb-6">
              <CustomText variant="h5" className="mb-4">
                Categories
              </CustomText>
              <View className="flex-row flex-wrap">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                      selectedCategory === category
                        ? "bg-accent border-primary"
                        : "bg-transparent dark:border-gray-700"
                    }`}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <CustomText
                      variant="body"
                      className={
                        selectedCategory === category
                          ? "text-primary"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    >
                      {category}
                    </CustomText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sorting Section */}
            <View>
              <CustomText variant="h5" className="mb-4">
                Sort By
              </CustomText>

              <TouchableOpacity
                className={`p-3 mb-2 rounded-lg flex-row items-center ${sortBy === "recent" ? "bg-gray-100 dark:bg-neutral-900" : ""}`}
                onPress={() => {
                  setSortBy("recent");
                }}
              >
                <Icon
                  name="time-outline"
                  family="Ionicons"
                  size={20}
                  color={sortBy === "recent" ? Colors.primary : "#666666"}
                />
                <CustomText
                  variant="body"
                  className={`ml-2 ${sortBy === "recent" ? "text-primary" : ""}`}
                >
                  Most Recent
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                className={`p-3 mb-2 rounded-lg flex-row items-center ${sortBy === "oldest" ? "bg-gray-100 dark:bg-neutral-900" : ""}`}
                onPress={() => {
                  setSortBy("oldest");
                }}
              >
                <Icon
                  name="search-outline"
                  family="Ionicons"
                  size={20}
                  color={sortBy === "oldest" ? Colors.primary : "#666666"}
                />
                <CustomText
                  variant="body"
                  className={`ml-2 ${sortBy === "oldest" ? "text-primary dark:bg-primary" : ""}`}
                >
                  Oldest
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </ScreenWrapper>
  );
}
