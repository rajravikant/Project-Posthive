import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import BackButton from "../ui/BackButton";
import CustomText from "../ui/CustomText";
// import { auth } from "@/utils/firebaseConfig";

const logoutAction = () => {
  // auth.signOut();
};

const LogoutButton = () => {
  return (
    <TouchableOpacity
      onPress={logoutAction}
      className="p-2 bg-gray-400 rounded-lg self-start"
    >
      <AntDesign name="logout" size={24} color='red' />
    </TouchableOpacity>
  );
};

interface HeaderProps {
  buttonBack?: boolean;
  mb?: number;
  title: string;
  logoutShow?: boolean;
}

const Header = ({ buttonBack, title, logoutShow, mb = 10 }: HeaderProps) => {
  const router = useRouter();
  return (
    <View className="flex-row justify-between items-center mb-2">
      <View className="flex-row gap-5">
        {buttonBack && <BackButton router={router} />}
        {logoutShow && <LogoutButton />}
      </View>
     <CustomText variant="h2" >
        {title}
     </CustomText>
    </View>
  );
};

export default memo(Header);

