import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/ui/Button'
import CustomText from '@/components/ui/CustomText'
import { Link } from 'expo-router'
import React from 'react'

export default function RequireLogin() {
    
  return (
   <ScreenWrapper>
    <CustomText variant='h1'>Please log in to continue</CustomText>
    <CustomText variant='body'>You need to be logged in to access this content.</CustomText>

    <Link href={"/login"} asChild>
      <Button >
        <CustomText>Login</CustomText>
      </Button>
    </Link>
   </ScreenWrapper>
  )
}