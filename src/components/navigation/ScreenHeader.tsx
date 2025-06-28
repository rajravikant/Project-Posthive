import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { memo } from "react";
import {
  Pressable,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


interface Props {
  onPress: () => void;
  isBookmarked: boolean;
}

const ScreenHeader = ({onPress, isBookmarked = false}:Props) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 20;
  // const isPresented = router.canGoBack();
  return (
    <View className="absolute px-5 w-full flex-row justify-between items-center z-50" style={{ paddingTop }}>
      <View>
        <Pressable
          onPress={() => router.dismiss()}
          className="self-start p-2.5 rounded-full bg-black/20"
        >
          <Ionicons name="chevron-back-sharp" size={24} color="white" />
        </Pressable>
      </View>
        <TouchableOpacity onPress={onPress} className="self-start p-2.5 rounded-full bg-black/20">
          {isBookmarked ? (
            <Ionicons name="bookmark" size={24} color="white" />
          ) : (
            <Ionicons name="bookmark-outline" size={24} color="white" />
          )}
        </TouchableOpacity>
       
    </View>
  );
};

export default memo(ScreenHeader);

