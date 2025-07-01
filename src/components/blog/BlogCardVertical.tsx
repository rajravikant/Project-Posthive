import { PostType } from "@/types/post";
import { cn } from "@/utils/style.utils";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Image, TouchableOpacity, View } from "react-native";
import Badge from "../ui/Badge";
import CustomText from "../ui/CustomText";
interface BlogCardProps {
  isAuthor?: boolean;
  onPress?: () => void;
  className?: string;
}



const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
}

export const BlogCardVertical = ({
  title,
  imageUrl,
  content,
  creator,
  category,
  createdAt,
  updatedAt,
  onPress,
  className,
  isAuthor = false,
}: PostType & BlogCardProps) => {
  const timeToRead = Math.ceil(content.split(" ").length / 200); // Assuming average reading speed of 200 words per minute
  const {colorScheme} = useColorScheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("rounded-xl mb-4 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800",
        className,
      )}
    >
      <View className="flex-row items-center gap-4 ">
        <Image
          source={{ uri: imageUrl }}
          className="size-32 object-cover rounded-xl"
        />
        <View className="flex-1 items-start justify-between h-full">
          <View className="items-start gap-2">
          <Badge text={category} />
          <CustomText variant="h5">{title}</CustomText>
          </View>

          <View className="flex-row items-center gap-2 mt-1">
            {isAuthor ? (
              <View className="gap-2 ">
                <View className="flex-row gap-2 items-center">
                  <MaterialIcons name="post-add" size={20} color={colorScheme === "dark" ? "#5f5f5f" : "black"} />
                  <CustomText>Posted on :{formatDate(createdAt)}</CustomText>
                </View>
                <View className="flex-row gap-2 items-center">
                  <MaterialCommunityIcons name="update" size={20} color={colorScheme === "dark" ? "#5f5f5f" : "black"} />
                  <CustomText>Last updated {formatDate(updatedAt)}</CustomText>
                </View>
              </View>
            ) : (
              <>
                <CustomText
                  variant="body"
                  className="text-gray-500 dark:text-gray-400"
                >
                  by {creator.username}
                </CustomText>
                <CustomText
                  variant="body"
                  className="text-gray-500 dark:text-gray-400"
                >
                  {timeToRead} min read
                </CustomText>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
