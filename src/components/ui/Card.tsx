import { cn } from '@/utils/style.utils'
import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

interface CardProps {
    classNames ?: object
}

const Card = ({classNames, children}: PropsWithChildren<CardProps>) => {
    return (
        <View className={cn("rounded-md p-5 border border-gray-200 bg-white shadow-sm", classNames)}>
            {children}
        </View>
    )
}
export default Card;