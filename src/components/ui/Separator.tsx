import { cn } from '@/utils/style.utils'
import React from 'react'
import { View } from 'react-native'
export default function Separator({className}: {className?: string}) {
  return (
    <View className={cn("my-5 border-b border-gray-200 dark:border-gray-600", className)} />
  )
}