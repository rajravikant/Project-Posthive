import { cn } from "@/utils/style.utils";
import React, { memo } from "react";
import { Image } from "react-native";

interface AvatarProps {
  uri: string;
  className?: string
}

const Avatar = ({
  uri,
  className,
}: AvatarProps) => {


  return (
    <Image
      source={{ uri }}
      defaultSource={require("@/assets/images/userplaceholder.png")}
      className={cn("rounded-full size-12 shadow", className)}
    />
  );
};

export default memo(Avatar);
