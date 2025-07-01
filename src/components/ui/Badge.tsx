import React from 'react'
import { Text, View } from 'react-native'

export default function Badge({text}: {text: string}) {
  return (
    <View className=' me-2 px-2.5 py-1 rounded-lg dark:bg-neutral-900 bg-neutral-100/50   border border-gray-500'>
      <Text className='dark:text-gray-400 text-neutral-700 text-xs font-OutFit_Medium'>{text}</Text>
    </View>
  )
}