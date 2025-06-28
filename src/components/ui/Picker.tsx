import { cn } from "@/utils/style.utils";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

type PickerOption = {
  label: string;
  value: string;
};

type PickerProps = {
  options: PickerOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export const Picker: React.FC<PickerProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <>
      <Pressable
        className={cn(
          "flex-row relative items-center bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-4 "
        )}
        onPress={() => setModalVisible(true)}
      >
        <Text
          className="flex-1 text-base text-gray-800 dark:text-white font-OutFit_Regular leading-normal "
        >
          {selectedLabel}
        </Text>

        <View className="ml-2 justify-center items-center">
            <Feather name="chevron-down" size={24} color="gray" />
        </View>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className={cn("flex-1 bg-black/30 justify-center items-center")}
          onPress={() => setModalVisible(false)}
        >
          <View className={cn("bg-white rounded w-72 max-h-96")}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  className={cn("px-4 py-3 border-b border-gray-100")}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    className={cn(
                      item.value === selectedValue
                        ? "text-blue-600 font-bold"
                        : "text-gray-700"
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
