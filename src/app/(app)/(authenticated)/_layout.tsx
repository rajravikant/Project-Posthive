import { Stack } from 'expo-router';
import React from 'react';


const Layout = () => {
 
  return (
    <Stack screenOptions={{ headerShown: false ,animation : "ios_from_right"}} initialRouteName='(tabs)' >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="search"/>
      <Stack.Screen name="editProfile" options={{
        presentation:'formSheet',
        animation: "slide_from_bottom",
        sheetAllowedDetents: [0.8],
        sheetGrabberVisible: true,
        sheetCornerRadius: 20,
        headerShown: true,
        headerTitle: "Edit Profile",

      }}/>
      <Stack.Screen name="userProfile" options={{
        presentation:'containedModal',
      }}/>
      <Stack.Screen name="notifications"/>

      
    </Stack>
  )
}

export default Layout;