import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export type RouteName = 'index' | 'addpost' | 'bookmarks';

interface TabBarButtonProps {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  label: any;
  routeName: RouteName;
  options: {
    tabBarAccessibilityLabel?: string;
    tabBarButtonTestID?: string;
  };
}

const icons = {
  index: (props: { color: string }) => (
    <Feather name="home" size={24} color={props.color} />
  ),
  addpost: (props: { color: string }) => (
    <Feather name="plus-circle" size={24} color={props.color} />
  ),
  bookmarks: (props: { color: string }) => (
    <Feather name="bookmark" size={24} color={props.color} />
  ),
  userblogs: (props: { color: string }) => (
    <Feather name="book" size={24} color={props.color} />
  ),
};

export default function TabBarButton({
  isFocused,
  label,
  onLongPress,
  onPress,
  routeName,
  options,
}: TabBarButtonProps) {


    const scale = useSharedValue(0)

    useEffect(()=>{
        scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,{
            duration : 350
        })
    },[isFocused, scale])

    const animatedTextStyle = useAnimatedStyle(()=>{
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity
        };
    })

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);
        return {
            transform: [{ scale: scaleValue }],
            top: top,
        };
    } );



  return (
    <Pressable
      role="tab"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center font-OutFit_Regular "
    >
    <Animated.View style={[{alignItems : "center"}, animatedIconStyle]}>
      {icons[routeName]({ color: isFocused ? "#fff" : "#8E8E93" })}

      <Animated.Text
        style={[{
          color: isFocused ? "#4A90E2" : "#8E8E93",
          fontFamily: "OutFit-Regular",
          fontSize: 12,
        }, animatedTextStyle]}
      >
        {label}
      </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
