import useAuthStore from "@/store/authStore";
import { hp } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";



const HomeHeader = () => {
  const router = useRouter()
  const {colorScheme} = useColorScheme()
  const {isGuest,currentUser,logout} = useAuthStore()
  
  return (
    <View className={" "}  >
      <View className="p-2 flex-row items-center justify-end">
      <View className={"flex-row-reverse items-center gap-5"} >
        {!isGuest ? currentUser && (
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Avatar
            uri={currentUser.avatar} 
          />
        </TouchableOpacity>
        ) : <Button variant="outline" onPress={logout}>Login</Button>}

        <TouchableOpacity onPress={() => router.push("/(app)/(authenticated)/search")}>
          <Ionicons name="search" size={hp(3)} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default HomeHeader;
