import { getUserProfile } from '@/api/auth'
import { BlogCardVertical } from '@/components/blog/BlogCardVertical'
import Header from '@/components/navigation/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import CustomText from '@/components/ui/CustomText'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import { formatDistance } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'

export default function UserPublicProfile() {
    const { username } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Fetch user profile
    const {
        data: user,
        isLoading: isLoadingUser,
        isError: isUserError,
        error: userError,
        refetch: refetchUser,
    } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => getUserProfile(username as string),
    });

    
    
    const posts = user?.posts || [];

    const handleRefresh = () => {
        refetchUser();
    };

    if (isLoadingUser) {
        return (
            <ScreenWrapper>
                <Header title={`${username}'s Profile`} buttonBack />
                <View className="flex-1 items-center justify-center p-4">
                    <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4" />
                    <View className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2" />
                    <View className="w-60 h-4 bg-gray-200 dark:bg-gray-700 rounded-md" />
                </View>
            </ScreenWrapper>
        );
    }

    if (isUserError) {
        return (
            <ScreenWrapper>
                <Header title="User Profile" buttonBack />
                <View className="flex-1 items-center justify-center p-4">
                    <Feather name="alert-circle" size={50} color={isDark ? "#e11d48" : "#f43f5e"} />
                    <CustomText variant="h3" className="mt-4 text-red-500">Error Loading Profile</CustomText>
                    <CustomText variant="body" className="text-gray-500 dark:text-gray-400 text-center mt-2">
                        {userError?.message || "Failed to load user profile"}
                    </CustomText>
                    <TouchableOpacity 
                        className="mt-6 bg-blue-500 rounded-lg px-6 py-3 flex-row items-center"
                        onPress={() => refetchUser()}
                    >
                        <Feather name="refresh-ccw" size={16} color="#fff" />
                        <CustomText variant="body" className="text-white ml-2">Try Again</CustomText>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }

   

    // Format the join date
    const joinedDate = user?.createdAt ? formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true }) : '';

    return (
        <ScreenWrapper>
            <Header title={`${user?.username}'s Profile`} buttonBack />

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {/* Profile Header with Cover and Avatar */}
                <View className="w-full ">
                  
                    
                        <View className="w-32 h-32 mx-auto rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {user?.avatar ? (
                                <Image 
                                    source={{ uri: user.avatar }} 
                                    className="w-full h-full" 
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-full h-full items-center justify-center bg-blue-500">
                                    <CustomText variant="h1" className="text-white">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </CustomText>
                                </View>
                            )}
                        </View>
                </View>
                
                {/* User Info Section */}
                <View className="mt-5 px-5">
                    <CustomText variant="h1" className="dark:text-white">
                        {user?.username}
                    </CustomText>
                    <CustomText variant="body" className="text-gray-600 dark:text-gray-400">
                        @{user?.email}
                    </CustomText>
                    
                  
                    
                    <View className="flex-row items-center mt-2">
                        <Feather name="calendar" size={14} color={isDark ? "#9ca3af" : "#6b7280"} />
                        <CustomText variant="body" className="text-gray-500 dark:text-gray-400 ml-1">
                            Joined {joinedDate}
                        </CustomText>
                    </View>
                   
                </View>
                
                <View className="my-4 border-b border-gray-200 dark:border-gray-600" />
                
                {/* User Stats/Additional Info */}
                <View className="px-5 mb-4">
                    <View className="flex-row justify-between">
                        <View className="flex-row items-center">
                            <Feather name="file-text" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
                            <CustomText variant="body" className="text-gray-700 dark:text-gray-300 ml-2">
                                {posts?.length || 0} blog posts
                            </CustomText>
                        </View>
                        
                        <View className="flex-row items-center">
                            <Feather name="mail" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
                            <CustomText variant="body" className="text-gray-700 dark:text-gray-300 ml-2">
                                {user?.email}
                            </CustomText>
                        </View>
                    </View>
                </View>
                
                {/* Section Title */}
                <View className="px-5 flex-row items-center">
                    <CustomText variant="h3" className="dark:text-white">
                        Posts
                    </CustomText>
                    <View className="ml-2 flex-1 border-b border-gray-200 dark:border-gray-700" />
                </View>
                
                {/* Posts Section */}
                <View className="px-5 py-4 flex-1" style={{ minHeight: 300 }}>
                    {posts?.length === 0 ? (
                        <View className="items-center justify-center py-10">
                            <Feather name="file-text" size={40} color={isDark ? "#6b7280" : "#9ca3af"} />
                            <CustomText variant="h5" className="text-gray-500 dark:text-gray-400 mt-2">
                                No posts yet
                            </CustomText>
                            <CustomText variant="body" className="text-gray-500 dark:text-gray-400 text-center mt-1">
                                This user hasn't shared any blog posts
                            </CustomText>
                        </View>
                    ) : (
                        <View className="flex-1" >
                            <FlashList
                                data={posts}
                                estimatedItemSize={140}
                                keyExtractor={item => item._id}
                                renderItem={({ item }) => (
                                    <BlogCardVertical 
                                        {...item}
                                        onPress={() => router.navigate({
                                            pathname: "/blog/[slug]",
                                            params: { slug: item.slug }
                                        })}
                                    />
                                )}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => <View className="h-4" />}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        </View>
                    )}
                </View>
                
                {/* About Section */}
                <View className="px-5 py-4">
                    <View className="flex-row items-center mb-4">
                        <CustomText variant="h3" className="dark:text-white">
                            About
                        </CustomText>
                        <View className="ml-2 flex-1 border-b border-gray-200 dark:border-gray-700" />
                    </View>
                    
                    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <View className="flex-row items-center">
                            <Feather name="user" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
                            <CustomText variant="body" className="text-gray-700 dark:text-gray-300 ml-2">
                                @{user?.username}
                            </CustomText>
                        </View>

                        <View className="flex-row items-center mt-3">
                            <Feather name="calendar" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
                            <CustomText variant="body" className="text-gray-700 dark:text-gray-300 ml-2">
                                Member since {joinedDate}
                            </CustomText>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}


