import { deleteAccount, logoutUser } from "@/api/auth";
import Header from "@/components/navigation/Header";
import SettingItem from "@/components/profile/SettingItem";
import ScreenWrapper from "@/components/ScreenWrapper";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import { Colors, Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { memo } from "react";
import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";


const Page = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const {logout,currentUser} = useAuthStore();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn : async()=>deleteAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries()
      logout();
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        "There was an error deleting your account. Please try again later.",
        [{ text: "OK" }]
      );
      console.error("Error deleting account:", error);
    }
  })

  const logoutHandler = async () => {
    try {
      if (GoogleSignin.getCurrentUser()) {
        await GoogleSignin.signOut();
        await logoutUser();
        logout(); 
        return
      }
      await logoutUser();
      logout(); 
    } catch (error) {
      console.log("Logout error:", error);
    }
  }

  const deleteProfileHandler = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate();
          },
        },
      ],
    );
  };

 
  return (
    <ScreenWrapper>
     
      
      <Header title="Profile" buttonBack  />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-16 items-center">
          <View className="border-4 border-white dark:border-gray-900 rounded-full">
            <Avatar uri={currentUser?.avatar!} className={"size-32"} />
          </View>
       
        </View>
        
        {/* Profile Info */}
        <View className="px-4 mb-6">
          <CustomText variant="h1" fontFamily={Fonts.Bold} className="text-gray-900 dark:text-white">
            {currentUser?.username || "N/A"}
          </CustomText>

          <View className="flex-row mt-6 justify-between">
            <View className="items-center">
              <CustomText fontFamily={Fonts.Bold} className="text-gray-900 dark:text-white">
                {currentUser?.posts.length || 0}
              </CustomText>
              <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
                Posts
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText fontFamily={Fonts.Bold} className="text-gray-900 dark:text-white">
                {currentUser?.posts.length || 0}
              </CustomText>
              <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
                Comments
              </CustomText>
            </View>
            <View className="items-center">
              <CustomText fontFamily={Fonts.Bold} className="text-gray-900 dark:text-white">
                986
              </CustomText>
              <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
                Likes
              </CustomText>
            </View>
          </View>
            <View className="flex-row mt-6 gap-2">
         
              <Button 
                variant="secondary" 
                className="flex-1" 
                onPress={deleteProfileHandler}
                disabled={deleteMutation.isPending}
                loading={deleteMutation.isPending}
              >
                Delete Profile
              </Button>
              <Button 
                variant="primary" 
                className="flex-1" 
                onPress={()=>router.push("/editProfile")}
              >
                Edit Profile
              </Button>
            </View>

         
        </View>
     
          <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 mx-2 mb-6">
            <CustomText fontFamily={Fonts.SemiBold} className="text-gray-900 dark:text-white mb-2">
              Quick Settings
            </CustomText>
            
            <SettingItem
              icon={<Ionicons name={isDark ? "moon" : "sunny"} size={22} color={isDark ? "#fff" : "#FDB813"} />}
              title="Dark Mode"
              subtitle="Change app appearance"
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: "#D1D5DB", true: Colors.accent }}
                  thumbColor={isDark ? Colors.primary : "#f4f3f4"}
                />
              }
            />
            
            
          </View>
       
          {/* Account Settings - Only visible in owner view */}

          <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 mx-2 mb-6">
            <CustomText fontFamily={Fonts.SemiBold} className="text-gray-900 dark:text-white mb-2">
              Account Settings
            </CustomText>
            <SettingItem
              icon={<Feather name="lock" size={20} color={Colors.primary} />}
              title="Privacy & Security"
              subtitle="Manage yourgl account security"
              rightElement={<Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />}
            />
            
            <SettingItem
              icon={<Feather name="file-text" size={20} color={Colors.primary} />}
              title="Manage Your Posts"
              onPress={()=>router.push("/(app)/(authenticated)/(tabs)/userblogs")}
              subtitle="Edit, archive or delete your content"
              rightElement={<Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />}
            />
            
            <SettingItem
              icon={<Ionicons name="help-circle-outline" size={22} color={Colors.primary} />}
              title="Help & Support"
              subtitle="Get assistance and feedback"
              rightElement={<Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />}
            />
          </View>

             <TouchableOpacity 
            className="mx-2 mb-10 py-4 rounded-xl flex-row items-center justify-center bg-red-50 dark:bg-red-900/20"
            onPress={logoutHandler}
          >
            <Feather name="log-out" size={20} color="#dc2626" />
            <CustomText className="ml-2 text-red-600 dark:text-red-400 font-semibold">
              Sign Out
            </CustomText>
          </TouchableOpacity>
      
        
     
      </ScrollView>
    </ScreenWrapper>


    
  );
};

export default memo(Page);

