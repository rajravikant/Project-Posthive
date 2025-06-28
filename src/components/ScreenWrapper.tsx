import { wp } from "@/utils/common";
import { cn } from "@/utils/style.utils";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React, { memo, ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({
  children,
  bg,
  className,
  style,
}: {
  children: ReactNode;
  bg?: string;
  className?: string;
  style?: ViewStyle;
}) => {
  const { top } = useSafeAreaInsets();
  const {colorScheme} = useColorScheme()
  const paddingTop = top > 0 ? top + 5 : 20;
  return (
    <React.Fragment>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View
        className={cn("flex-1",
          bg ? bg : "bg-background dark:bg-backgroundDark",
           className)}
        style={[
          {
            paddingTop,
            paddingHorizontal: wp(5),
            width: wp(100),
          },
          style
        ]}
      >
        {children}
      </View>
    </React.Fragment>
  );
};

export default memo(ScreenWrapper);
