import { cn } from "@/utils/style.utils";
import React, { FC } from "react";
import { Text, View } from "react-native";
import { Fonts } from "../../constants/theme";


type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8" | "h9" | "body";

interface Props {
  variant?: Variant;
  fontFamily?: Fonts;
  fontSize?: number;
  children?: React.ReactNode;
  className?: string;
  numberOfLines?: number;
}

const CustomText: FC<Props> = ({
  variant = "body",
  fontFamily = Fonts.Regular,
  fontSize,
  children,
  numberOfLines,
  className
}) => {
  let computedFontSize: number;
  switch (variant) {
    case "h1":
      computedFontSize = fontSize || 22;
      break;
    case "h2":
      computedFontSize = fontSize || 20;
      break;
    case "h3":
      computedFontSize = fontSize || 18;
      break;
    case "h4":
      computedFontSize = fontSize || 16;
      break;
    case "h5":
      computedFontSize = fontSize || 14;
      break;
    case "h6":
      computedFontSize = fontSize || 12;
      break;
    case "h7":
      computedFontSize = fontSize || 12;
      break;
    case "h8":
      computedFontSize = fontSize || 10;
      break;
    case "h9":
      computedFontSize = fontSize || 9;
      break;
    default:
      computedFontSize = fontSize || 12;
  }

  return (
    <View className="flex-row flex-wrap items-center">
      <Text
        numberOfLines={numberOfLines !== undefined ? numberOfLines : undefined}
        style={{
          fontSize: computedFontSize,
          fontFamily: fontFamily,
        }}
        className={cn("text-left text-dark dark:text-light", className)}
      >
        {children}
      </Text>
    </View>
  );
};



export default CustomText;
