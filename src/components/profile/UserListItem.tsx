import { useUnfollowAuthorMutation } from "@/api/use-posts";
import { Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { FollowFollower } from "@/types/user";
import { useRouter } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import CustomText from "../ui/CustomText";

const UserListItem = ({ user }: { user: FollowFollower }) => {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const unfollowMutation = useUnfollowAuthorMutation(
    user.username,
    currentUser?.username!
  );

  const unfollowHandler = () => {
    unfollowMutation.mutate(user._id, {
      onSuccess: () => {
        Alert.alert("Unfollowed", `You have unfollowed ${user.username}`);
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to unfollow user. Please try again.");
        console.error("Unfollow error:", error);
      },
    });
  };
  return (
    <View className="flex-row items-center py-3 px-4 border-b border-gray-100 dark:border-neutral-900">
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/userProfile",
            params: { username: user.username },
          })
        }
        className="flex-row items-center"
      >
        <Avatar uri={user.avatar} className="size-12" />
      </TouchableOpacity>

      <View className="ml-3 flex-1">
        <CustomText
          fontFamily={Fonts.SemiBold}
          className="text-gray-900 dark:text-white"
        >
          {user.username}
        </CustomText>
      </View>
      <Button
        variant="outline"
        size="sm"
        disabled={unfollowMutation.isPending}
        loading={unfollowMutation.isPending}
        onPress={unfollowHandler}
      >
        Unfollow
      </Button>
    </View>
  );
};

export default UserListItem;
