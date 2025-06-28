import { cn } from '@/utils/style.utils'
import { useColorScheme } from 'nativewind'
import React, { forwardRef } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import Icon from './Icon'


interface InputFieldProps {
    placeholder : string
    value : string
    onChangeText : (text : string) => void
    secureTextEntry? : boolean
    containerClassName? : string
    className? : string
    icon? : {name : string, color? : string , size : number , family : "Ionicons" | "FontAwesome5" | "AntDesign"}
    iconClassName? : string
    placeholderTextColor?: string
}

const InputField = forwardRef<TextInput, InputFieldProps & TextInputProps>(({
  placeholder,
  value,
  onChangeText,
  containerClassName,
  className,
  secureTextEntry,
  icon,
  iconClassName,
  placeholderTextColor,
  ...props
}, ref) => {  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const iconProps = icon ? {
    name: icon.name,
    family: icon.family,
    size: icon.size,
    color: isDark ? '#ffffff' : '#333333'
  } : null

  return (
    <View className={cn(
      "flex-row relative items-center",
      "bg-white dark:bg-neutral-950",
      "border border-gray-200 dark:border-gray-700",
      "rounded-xl overflow-hidden",
      "py-2 px-4",
      containerClassName
    )}>     
     {iconProps && (
        <View className="mr-3 justify-center items-center">
          <Icon 
            {...iconProps} 
            className={iconClassName} 
          />
        </View>
      )}
      <TextInput
        placeholder={placeholder}
        value={value} 
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        className={cn(
          "flex-1 text-base text-gray-800 dark:text-white font-OutFit_Regular",
          "leading-normal",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          className
        )}
        placeholderTextColor={placeholderTextColor || (isDark ? '#6b7280' : '#9ca3af')}
        ref={ref}
        multiline={false}
        {...props}      />
    </View>
  );
});

export default InputField;
