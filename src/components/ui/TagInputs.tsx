import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import React, { useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import CustomText from './CustomText'
import Icon from './Icon'

interface TagInputsProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  maxTags?: number
  placeholder?: string
  className?: string
  label?: string
  error?: string
}

export default function TagInputs({
  tags,
  setTags,
  maxTags = 10,
  placeholder = 'Add a tag...',
  className = '',
  label = 'Tags',
  error
}: TagInputsProps) {
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<TextInput>(null)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Function to add a tag
  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (
      trimmedValue &&
      !tags.includes(trimmedValue) &&
      tags.length < maxTags
    ) {
      setTags([...tags, trimmedValue])
      setInputValue('')
    }
  }

  // Function to remove a tag
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  // Function to handle key press events
  const handleKeyPress = ({ nativeEvent }: { nativeEvent: { key: string } }) => {
    if (nativeEvent.key === 'Enter' || nativeEvent.key === ',') {
      addTag()
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`w-full ${className}`}
    >
      {label && (
        <CustomText variant="body" className="mb-1 font-medium">
          {label} {maxTags > 0 && `(${tags.length}/${maxTags})`}
        </CustomText>
      )}
      
      <View 
        className={`flex-row items-center flex-wrap bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 mt-1  ${error ? 'border-red-500' : ''}`}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}
          className="flex-grow"
        >
          {tags.map((tag, index) => (
            <View 
              key={index} 
              className={`flex-row items-center m-1 p-2 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-accent'}`}
            >
              <Text 
                className={`mr-1 text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}
              >
                {tag}
              </Text>
              <TouchableOpacity onPress={() => removeTag(index)}>
                <Icon 
                  name="close-circle" 
                  family="Ionicons" 
                  size={16} 
                  color={isDark ? '#e0e0e0' : '#666666'} 
                />
              </TouchableOpacity>
            </View>
          ))}
          
          <View className="flex-grow flex-row items-center">
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={addTag}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              placeholderTextColor={isDark ? '#999' : '#aaa'}
              className={`flex-1 p-2 text-base ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            />
          </View>
        </ScrollView>
        
        <TouchableOpacity 
          onPress={addTag}
          disabled={!inputValue.trim() || tags.length >= maxTags}
          className={`p-2 rounded-full ${
            !inputValue.trim() || tags.length >= maxTags
              ? 'opacity-50'
              : ''
          }`}
        >
          <Icon 
            name="add-circle" 
            family="Ionicons" 
            size={24} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>
      
      {error && (
        <CustomText variant="h6" className="text-red-500 mt-1">
          {error}
        </CustomText>
      )}
      
      {tags.length >= maxTags && (
        <CustomText variant="h6" className="text-amber-500 mt-1">
          Maximum number of tags reached ({maxTags})
        </CustomText>
      )}
      
      <View className="flex-row flex-wrap mt-2">
        {tags.length === 0 && (
          <CustomText variant="h6" className="text-gray-500 dark:text-gray-400 italic">
            No tags added yet
          </CustomText>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}