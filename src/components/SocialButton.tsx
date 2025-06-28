import { cn } from "@/utils/style.utils";
import { TouchableOpacity } from "react-native";

const SocialButton = ({
  icon,
  color,
  bgColor,
  onPress,
}: {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      "w-14 h-14 rounded-full justify-center items-center mr-4",
      `bg-[${bgColor}]`
    )}
    activeOpacity={0.8}
  >
    {icon}
  </TouchableOpacity>
);

export default SocialButton;