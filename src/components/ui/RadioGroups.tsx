import { Radio } from "@/constants/types";
import { cn } from "@/utils/style.utils";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  options: Radio[];
  onSelected: (value: string) => void;
  selected: string;
  containerClassName?: string;
  radioClassName?: string;
  labelClassName?: string;
}
const RadioGroups = ({
  options,
  onSelected,
  radioClassName,
  selected,
  containerClassName,
  labelClassName,
}: Props) => {
  const [select, setSelect] = React.useState<string>(selected);
  return (
    <View className={cn("flex-row justify-center items-center gap-2.5", containerClassName)}>
      {options.map((item, index) => (
        <Pressable
          key={index}
          className={cn(
            "justify-between gap-2.5 items-center p-5 border border-primary rounded-lg min-w-[100px]",
            select === item.value && "bg-[rgba(147,129,255,0.2)]", // using the shade color from theme
            radioClassName
          )}
          onPress={(e) => {
            setSelect(item.value);
            onSelected(item.value);
          }}
        >
          {item.icon && item.icon}
          <Text className={cn("text-primary font-[Outfit-SemiBold] text-xl", labelClassName)}>
            {item.label}
          </Text>
          {item.desc && (
            <Text className="text-left font-[Outfit-Light] text-[#494949]">
              {item.desc}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export default memo(RadioGroups);
