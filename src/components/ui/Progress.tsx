import { cn } from "@/utils/style.utils";
import React from "react";
import { View } from "react-native";

interface Props {
  steps: number[];
  currentStepIndex: number;
  containerClassName?: string;
  progressClassName?: string;
}

const Progress = ({
  steps,
  currentStepIndex,
  containerClassName,
  progressClassName,
}: Props) => {
  return (
    <View className={cn("flex-row justify-between gap-2.5 w-full", containerClassName)}>
      {steps.map((step, index) => (
        <View
          key={index}
          className={cn(
            "flex-1 h-2 rounded-full items-center justify-center",
            currentStepIndex === index ? "bg-primary" : "bg-[#EAEAEB]",
            progressClassName
          )}
        ></View>
      ))}
    </View>
  );
};

export default Progress;
