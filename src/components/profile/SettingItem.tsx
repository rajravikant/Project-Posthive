import { Fonts } from "@/constants/theme";
import { TouchableOpacity, View } from "react-native";
import CustomText from "../ui/CustomText";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem = ({ icon, title, subtitle, rightElement, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity 
      className="flex-row items-center py-4 px-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700 "
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <CustomText variant="body" fontFamily={Fonts.Medium} className="text-gray-800 dark:text-gray-100">
          {title}
        </CustomText>
        {subtitle && (
          <CustomText variant="body" fontSize={12} className="text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </CustomText>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );
};
export default SettingItem;