import { cn } from "@/utils/style.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { TouchableOpacity } from "react-native";

interface BackButtonProps {
  router: Router;
  className?: any;
}

const BackButton = ({ router, className }: BackButtonProps) => {
  const isPresented = router.canGoBack();
  const {colorScheme} = useColorScheme()
  return (
    <TouchableOpacity
      onPress={() => isPresented && router.back()}
      className={cn("p-2 rounded-full bg-black/10 dark:bg-black/50 self-start", className)}
    >
      <Ionicons name="chevron-back-sharp" size={24} color={colorScheme === "dark" ? "white" : "black"} />
    </TouchableOpacity>
  );
};

export default BackButton;
