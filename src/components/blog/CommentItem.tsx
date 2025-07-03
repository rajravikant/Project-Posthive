import { CommentType } from "@/types/post";
import { formatDistance } from "date-fns";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Avatar from "../ui/Avatar";
import CustomText from "../ui/CustomText";
import Icon from "../ui/Icon";

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
  const router = useRouter();
  return (
    <View className="p-4 bg-white dark:bg-neutral-800 rounded-lg mb-4 border border-gray-100 dark:border-neutral-700 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
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

export default CommentItem;
