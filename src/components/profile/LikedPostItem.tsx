import { Fonts } from "@/constants/theme";
import { LikedPosts } from "@/types/user";
import { cn } from "@/utils/style.utils";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, Pressable, View } from "react-native";
import Badge from "../ui/Badge";
import CustomText from "../ui/CustomText";

const LikedPostItem = ({ post }: { post: LikedPosts }) => {
  const router = useRouter();
  const isDark = useColorScheme().colorScheme === "dark";

  return (
    <Pressable
      className={cn(
        "flex-row items-center bg-white dark:bg-neutral-900 mb-3 p-1.5 rounded-md shadow-sm"
      )}
      onPress={() => router.push(`/blog/${post.slug}`)}
    >
      <View className="h-20 w-20 bg-gray-100 dark:bg-gray-700">
        {post.imageUrl ? (
          <Image
            source={{ uri: post.imageUrl }}
            className="h-full w-full rounded-md overflow-hidden"
            style={{ resizeMode: "cover" }}
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Feather
              name="image"
              size={24}
              color={isDark ? "#4b5563" : "#9ca3af"}
            />
          </View>
        )}
      </View>

      <View className="flex-1 p-3">
        <CustomText
          numberOfLines={1}
          fontFamily={Fonts.SemiBold}
          className="text-gray-900 dark:text-white"
        >
          {post.title}
        </CustomText>
        <View className="mt-1 items-start">
          <Badge text={post.category} />
        </View>
      </View>
    </Pressable>
  );
};

export default LikedPostItem;
