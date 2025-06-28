import Button from '@/components/ui/Button'
import CustomText from '@/components/ui/CustomText'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated'

export default function Welcome() {
    const {colorScheme} = useColorScheme()
    const router = useRouter()
  return (
    <View className='flex-1 items-center bg-background dark:bg-backgroundDark '>
      <Animated.View className="flex-1 pt-safe px-5 items-center justify-evenly gap-20" >

            <Animated.Image entering={ZoomIn.duration(1000).springify()} source={require("@/assets/images/welcome.png")}  style={{height:260,resizeMode:"contain"}} />

            <Animated.View entering={FadeInDown.delay(400)} className='mt-10'>
            <CustomText variant="h1" fontSize={36} className='text-center'>Welcome to Posthive Blogs</CustomText>
            <CustomText variant="h4" className='text-center mt-4 text-gray-400 dark:text-gray-300'>Your personal blogging platform to share your thoughts and ideas with the world.</CustomText>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600)} className='flex-row gap-4 justify-between mt-10'>
                <Button size='lg' onPress={() => router.push("/login")} variant='primary'  className='flex-1'>
                  Login
                </Button>
                <Button size='lg' onPress={() => router.push("/signup")} variant='secondary' className='flex-1'>
                  Signup
                </Button>
            </Animated.View>
        </Animated.View>
    </View>
  )
}