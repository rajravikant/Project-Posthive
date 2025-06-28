import { cn } from '@/utils/style.utils'
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

interface IconProps {
    size : number
    color : string
    family : "Ionicons" | "FontAwesome5" | "AntDesign"
    name : string | any
    className? : string
}


const Icon = ({size,color,family,name,className}:IconProps) => {
  return (
    <View className={cn("block", className)}>
        {family === "Ionicons" && <Ionicons name={name}size={size} color={color} />}
        {family === "FontAwesome5" && <FontAwesome5 name={name} size={size} color={color} />}
        {family === "AntDesign" && <AntDesign name={name} size={size} color={color} />}
    </View>
  )
}

export default Icon