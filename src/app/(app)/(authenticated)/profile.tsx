import { deleteAccount, getUserProfile, logoutUser } from "@/api/auth";
import Filters from "@/components/Filters";
import Header from "@/components/navigation/Header";
import LikedPostItem from "@/components/profile/LikedPostItem";
import SettingItem from "@/components/profile/SettingItem";
import UserListItem from "@/components/profile/UserListItem";
import ScreenWrapper from "@/components/ScreenWrapper";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import { Colors, Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { memo, useState } from "react";
import { Alert, Image, Pressable, RefreshControl, ScrollView, Switch, TouchableOpacity, View } from "react-native";

type ProfileTab = "posts" | "followers" | "following" | "liked posts";

const Page = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { logout, currentUser,onboardingCompleted,isOnboardingCompleted } = useAuthStore();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  
  const { data: userProfile, isLoading, isError, error ,refetch , isRefetching} = useQuery({
    queryKey: ["userProfile", currentUser?.username],
    queryFn: () => getUserProfile(currentUser?.username!)
  });
  
  const deleteMutation = useMutation({
    mutationFn: async () => deleteAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries();
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
  });


  const logoutHandler = async () => {
    try {
      if (GoogleSignin.getCurrentUser()) {
        await GoogleSignin.signOut();
        await logoutUser();
        logout(); 
        return;
      }
      await logoutUser();
      logout(); 
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

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

  // Filter options for profile tabs
  const tabOptions = ["posts", "followers", "following", "liked posts"];

  if (isError) {
    console.log(error);
    return null;
  }
  
  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark px-5 pt-safe">
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 animate-pulse" />
          <View className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse" />
          <View className="w-60 h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </View>
      </View>
    );
  }
  
  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return userProfile?.posts && userProfile.posts.length > 0 ? (
          <View className="mt-4 ">
            <FlashList 
            data={userProfile.posts} 
            keyExtractor={(item) => item._id}
            estimatedItemSize={205}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>(
                <TouchableOpacity 
                className="mb-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm"
                onPress={() => router.push(`/blog/${item.slug}`)}
              >
                <View className="h-40 bg-gray-100 dark:bg-gray-700">
                  {item.imageUrl ? (
                    <Image 
                      source={{ uri: item.imageUrl }} 
                      className="h-full w-full" 
                      style={{ resizeMode: 'cover' }}
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center">
                      <Feather name="image" size={24} color={isDark ? "#4b5563" : "#9ca3af"} />
                    </View>
                  )}
                </View>
                <View className="p-3">
                  <CustomText 
                    fontFamily={Fonts.SemiBold}
                    className="text-gray-900 dark:text-white text-lg mb-1"
                  >
                    {item.title}
                  </CustomText>
                  
                  <View className="flex-row items-center justify-between mb-2">
                     <Badge text={item.category} />
                    <CustomText className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            
            />
          </View>
        ) : (
          <View className="items-center justify-center p-8">
            <MaterialCommunityIcons name="post-outline" size={64} color={isDark ? "#4b5563" : "#d1d5db"} />
            <CustomText className="text-center mt-4 text-gray-500">
              You haven't created any posts yet
            </CustomText>
            <Button 
              variant="primary" 
              className="mt-4" 
              onPress={() => router.push("/addpost")}
            >
              Create New Post
            </Button>
          </View>
        );
      
      case "followers":
        return userProfile?.followers && userProfile.followers.length > 0 ? (
          <View className="mt-4">
            {userProfile.followers.map((follower) => (
              <UserListItem key={follower._id} user={follower} />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center p-8">
            <MaterialCommunityIcons name="account-group-outline" size={64} color={isDark ? "#4b5563" : "#d1d5db"} />
            <CustomText className="text-center mt-4 text-gray-500">
              You don't have any followers yet
            </CustomText>
          </View>
        );
      
      case "following":
        return userProfile?.following && userProfile.following.length > 0 ? (
          <View className="mt-4">
            {userProfile.following.map((following) => (
              <UserListItem key={following._id} user={following} />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center p-8">
            <MaterialCommunityIcons name="account-multiple-plus-outline" size={64} color={isDark ? "#4b5563" : "#d1d5db"} />
            <CustomText className="text-center mt-4 text-gray-500">
              You aren't following anyone yet
            </CustomText>
          </View>
        );
      
      case "liked posts":
        return userProfile?.likedPosts && userProfile.likedPosts.length > 0 ? (
          <View className="mt-4 px-2">
            {userProfile.likedPosts.map((post) => (
              <LikedPostItem key={post._id} post={post} />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center p-8">
            <MaterialCommunityIcons name="heart-outline" size={64} color={isDark ? "#4b5563" : "#d1d5db"} />
            <CustomText className="text-center mt-4 text-gray-500">
              You haven't liked any posts yet
            </CustomText>
          </View>
        );
    }
  };
 
  return (
    <ScreenWrapper>
      <Header title="Profile" buttonBack />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
        <View className="mb-4">
         
          
          <View className="items-center">
            <View className="border-4 border-white dark:border-gray-800 rounded-full shadow-lg">
              <Avatar uri={userProfile?.avatar!} className="size-32" />
            </View>
            
            <CustomText variant="h1" fontFamily={Fonts.Bold} className="text-gray-900 dark:text-white mt-3">
              {userProfile?.username || "N/A"}
            </CustomText>
            
            <View className="bg-white/80 dark:bg-neutral-800/80 px-4 py-1 rounded-full mt-1">
              <CustomText className="text-gray-600 dark:text-gray-300">
                {userProfile?.email || "Email not available"}
              </CustomText>
            </View>
          </View>
        </View>
        
        {/* Bio Section */}
        <View className="mb-6">
          <CustomText className="text-center text-gray-700 dark:text-gray-300">
            {userProfile?.bio || "No bio available"}
          </CustomText>
        </View>
        
        {/* Stats Row */}
        <View className="flex-row justify-around bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm mb-6">
          <Pressable 
            className="items-center" 
            onPress={() => setActiveTab("posts")}
          >
            <CustomText fontFamily={Fonts.Bold} className="text-lg text-gray-900 dark:text-white">
              {userProfile?.posts?.length || 0}
            </CustomText>
            <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
              Posts
            </CustomText>
          </Pressable>
          
          <Pressable 
            className="items-center"
            onPress={() => setActiveTab("followers")}
          >
            <CustomText fontFamily={Fonts.Bold} className="text-lg text-gray-900 dark:text-white">
              {userProfile?.followers?.length || 0}
            </CustomText>
            <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
              Followers
            </CustomText>
          </Pressable>
          
          <Pressable 
            className="items-center"
            onPress={() => setActiveTab("following")}
          >
            <CustomText fontFamily={Fonts.Bold} className="text-lg text-gray-900 dark:text-white">
              {userProfile?.following?.length || 0}
            </CustomText>
            <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
              Following
            </CustomText>
          </Pressable>
          
          <Pressable 
            className="items-center"
            onPress={() => setActiveTab("liked posts")}
          >
            <CustomText fontFamily={Fonts.Bold} className="text-lg text-gray-900 dark:text-white">
              {userProfile?.likedPosts?.length || 0}
            </CustomText>
            <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
              Likes
            </CustomText>
          </Pressable>
        </View>

        {/* Actions Row */}
        <View className="flex-row gap-2 mb-6">
          <Button 
            variant="secondary" 
            className="flex-1" 
            onPress={() => router.push({
              pathname: "/(app)/(authenticated)/editProfile",
              params: {
                username: userProfile?.username,
                email: userProfile?.email,
                bio: userProfile?.bio,
                avatar: userProfile?.avatar,
                lastUpdated : userProfile?.updatedAt
              }
            })}
          >
            Edit Profile
          </Button>
          
          <Button 
            variant="primary" 
            className="flex-1" 
            onPress={() => router.push("/addpost")}
          >
            Create Post
          </Button>
        </View>

        {/* Tabs Navigation */}
        <View >
          <Filters
            options={tabOptions}
            filter={activeTab}
            setFilter={(tab) => setActiveTab(tab as ProfileTab)}
            containerStyleClasses="mb-2"
          />
        </View>
        
        {/* Tab Content */}
        {renderTabContent()}
        
        {/* Settings Sections */}
        <View className="mt-8">
          {/* Quick Settings */}
          <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 mb-6 shadow-sm">
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
            <SettingItem
              icon={<Ionicons name="notifications-outline" size={22} color={Colors.primary} />}
              title="Onboarding Completed"
              subtitle={isOnboardingCompleted ? "Yes" : "No"}
              rightElement={
                <Switch
                  value={isOnboardingCompleted}
                  onValueChange={(val)=>onboardingCompleted(val)}
                  trackColor={{ false: "#D1D5DB", true: Colors.accent }}
                  thumbColor={isDark ? Colors.primary : "#f4f3f4"}
                />
              }
            />
          </View>
          
          {/* Account Settings */}
          <View className="bg-white dark:bg-neutral-900 rounded-xl p-4 mb-6 shadow-sm">
            <CustomText fontFamily={Fonts.SemiBold} className="text-gray-900 dark:text-white mb-2">
              Account Settings
            </CustomText>
            
            <SettingItem
              icon={<Feather name="lock" size={20} color={Colors.primary} />}
              title="Privacy & Security"
              subtitle="Manage your account security"
              rightElement={<Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />}
            />
            
            <SettingItem
              icon={<Feather name="file-text" size={20} color={Colors.primary} />}
              title="Manage Your Posts"
              onPress={() => router.push("/(app)/(authenticated)/(tabs)/userblogs")}
              subtitle="Edit, archive or delete your content"
              rightElement={<Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />}
            />
            
            <SettingItem
              icon={<Ionicons name="help-circle-outline" size={22} color={Colors.primary} />}
              title="Help & Support"
              subtitle="Get assistance and feedback"
              rightElement={<Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />}
            />
            
            <SettingItem
              icon={<Feather name="trash-2" size={20} color="#dc2626" />}
              title="Delete Account"
              subtitle="Permanently remove your account"
              onPress={deleteProfileHandler}
              rightElement={
                deleteMutation.isPending ? 
                <View className="h-5 w-5 rounded-full border-2 border-t-transparent border-red-500 animate-spin" /> : 
                <Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />
              }
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity 
            className="mb-10 py-4 rounded-xl flex-row items-center justify-center bg-red-50 dark:bg-red-900/20"
            onPress={logoutHandler}
          >
            <Feather name="log-out" size={20} color="#dc2626" />
            <CustomText className="ml-2 text-red-600 dark:text-red-400 font-semibold">
              Sign Out
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};



export default memo(Page);

