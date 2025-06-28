import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from '../ui/Icon'

export default function FloatingIconButton() {
  return (
   <TouchableOpacity className='absolute -top-[20%] left-[50%] -translate-x-[40] bg-primary rounded-full p-3 shadow-lg size-20 items-center justify-center'>
    <Icon family='Ionicons' name={"add-circle-outline"} size={24} color='#fff'  />
   </TouchableOpacity>
  )
}