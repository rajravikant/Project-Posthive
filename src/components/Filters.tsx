import { cn } from "@/utils/style.utils";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
interface FilterProps {
  filter : string
  setFilter: (key: string) => void;
  options: string[];
  selected?: string;
  containerStyleClasses?: string;
  tabStyleClasses?: string;
}

const Filters = ({
  options,
  selected,
  filter = selected || "All",
  setFilter,
  containerStyleClasses,
  tabStyleClasses,
}: FilterProps) => {
 
  return (
    <View
    className={cn("w-full flex-row  items-center gap-2", containerStyleClasses)}
     
    >
      <FlatList 
        data={options}
        renderItem={({ item }) => (
          <FilterTab
            value={item}
            filter={filter!}
            onFilter={setFilter}
            tabClassName={tabStyleClasses}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
};

export default Filters;

export const FilterTab = ({
  filter,
  value: item,
  onFilter,
  tabClassName,
}: {
  filter: string;
  value: string;
  onFilter: (key: string) => void;
  tabClassName?: string;
}) => {
  return (
    <TouchableOpacity
      className={cn("items-start",
        "px-6 py-1.5 rounded-full",
        filter === item ? "bg-rose-400/20 " : "bg-transparent",
        tabClassName
      )}

      onPress={() => onFilter(item)}
    >
      <Text
      className={cn("text-lg text-center font-OutFit_Regular",
        filter === item ? "text-primary font-OutFit_SemiBold" : "text-gray-500 "
      )}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
};
