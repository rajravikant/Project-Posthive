import { cn } from '@/utils/style.utils'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const IconButton = ({onPress,className}:{onPress : ()=>void,className?:string}) => {
  return (
    <TouchableOpacity onPress={onPress} className={cn("p-2 rounded-md justify-center items-center bg-gray-400 self-start",className)}>
      <Ionicons name="filter" size={24} color="white" />
    </TouchableOpacity>
  )
}

export default IconButton;

