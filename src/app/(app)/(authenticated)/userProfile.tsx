import { getUserProfile } from '@/api/auth'
import { useFollowAuthorMutation, useUnfollowAuthorMutation } from '@/api/use-posts'
import Filters from '@/components/Filters'
import Header from '@/components/navigation/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CustomText from '@/components/ui/CustomText'
import { Fonts } from '@/constants/theme'
import useAuthStore from '@/store/authStore'
import { FollowFollower } from '@/types/user'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { formatDistance } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useState } from 'react'
import { Alert, Image, Pressable, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native'

type ProfileTab = "posts" | "followers" | "following";

export default function UserPublicProfile() {
    const { username } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { currentUser,isGuest } = useAuthStore();
    const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
    const followMutation = useFollowAuthorMutation(username as string,currentUser?.username!)
    const unfollowMutation = useUnfollowAuthorMutation(username as string, currentUser?.username!);

    const {
        data: user,
        isLoading: isLoadingUser,
        isError: isUserError,
        error: userError,
        refetch: refetchUser,
        isRefetching
    } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => getUserProfile(username as string),
    });

    const isFollowing = user?.followers?.some(follower => follower.username === currentUser?.username );

    

    const handleFollowToggle = () => {
        if (!user?._id) return;
        
        if (isFollowing) {
            unfollowMutation.mutate(user._id,{
                onError : (error) => {
                    Alert.alert("Error", "Failed to unfollow user. Please try again.");
                    console.error("Unfollow error:", error);
                }
            });
        } else {
            followMutation.mutate(user._id,{
                onError : (error) => {
                    Alert.alert("Error", "Failed to follow user. Please try again.");
                    console.error("Follow error:", error);
                }
            });
        }
    };
    
    const tabOptions = ["posts", "followers", "following"];
    
    const posts = user?.posts || [];

    const handleRefresh = () => {
        refetchUser();
    };

    const joinedDate = user?.createdAt ? formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true }) : '';

    if (isLoadingUser) {
        return (
            <ScreenWrapper>
                <Header title={`${username}'s Profile`} buttonBack />
                <View className="flex-1 items-center justify-center p-4">
                    <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 animate-pulse" />
                    <View className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse" />
                    <View className="w-60 h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
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
    
    const renderTabContent = () => {
        switch (activeTab) {
            case "posts":
                return posts.length > 0 ? (
                    <View className="py-4">
                        {posts.map((post) => (
                            <TouchableOpacity 
                                key={post._id} 
                                className="mb-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm"
                                onPress={() => router.push(`/blog/${post.slug}`)}
                            >
                                <View className="h-40 bg-gray-100 dark:bg-gray-700">
                                    {post.imageUrl ? (
                                        <Image 
                                            source={{ uri: post.imageUrl }} 
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
                                        variant="h3"
                                        className="text-gray-900 dark:text-white mb-1"
                                    >
                                        {post.title}
                                    </CustomText>
                                    
                                    <View className="flex-row items-center justify-between mb-2">
                                       <Badge text={post.category}/>
                                        <CustomText className="text-xs text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </CustomText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View className="items-center justify-center py-10">
                        <MaterialCommunityIcons name="post-outline" size={64} color={isDark ? "#6b7280" : "#9ca3af"} />
                        <CustomText variant="h5" className="text-gray-500 dark:text-gray-400 mt-2">
                            No posts yet
                        </CustomText>
                        <CustomText variant="body" className="text-gray-500 dark:text-gray-400 text-center mt-1">
                            This user hasn't shared any blog posts
                        </CustomText>
                    </View>
                );
                
            case "followers":
                return user?.followers && user.followers.length > 0 ? (
                    <View className="py-4">
                        {user.followers.map((follower) => (
                            <UserListItem key={follower._id} user={follower} />
                        ))}
                    </View>
                ) : (
                    <View className="items-center justify-center py-10">
                        <MaterialCommunityIcons name="account-group-outline" size={64} color={isDark ? "#6b7280" : "#9ca3af"} />
                        <CustomText variant="h5" className="text-gray-500 dark:text-gray-400 mt-2">
                            No followers yet
                        </CustomText>
                    </View>
                );
                
            case "following":
                return user?.following && user.following.length > 0 ? (
                    <View className="px-5 py-4">
                        {user.following.map((following) => (
                            <UserListItem key={following._id} user={following} />
                        ))}
                    </View>
                ) : (
                    <View className="items-center justify-center py-10">
                        <MaterialCommunityIcons name="account-multiple-plus-outline" size={64} color={isDark ? "#6b7280" : "#9ca3af"} />
                        <CustomText variant="h5" className="text-gray-500 dark:text-gray-400 mt-2">
                            Not following anyone
                        </CustomText>
                    </View>
                );
        }
    };

    return (
        <ScreenWrapper>
            <Header title={`${user?.username}'s Profile`} buttonBack />

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh}/>}
            >
                {/* Profile Header */}
                <View className="items-center pt-8 pb-2">
                    <View className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
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
                <View className="mt-3 items-center">
                    <CustomText variant="h1" className="dark:text-white text-center">
                        {user?.username}
                    </CustomText>
                    
                    <CustomText variant="body" className="text-gray-600 dark:text-gray-400 text-center mt-1">
                        {user?.email}
                    </CustomText>
                    
                    {user?.bio && (
                        <CustomText variant="body" className="text-gray-700 dark:text-gray-300 text-center mt-2">
                            {user.bio}
                        </CustomText>
                    )}
                    
                    <View className="flex-row items-center mt-2">
                        <Feather name="calendar" size={14} color={isDark ? "#9ca3af" : "#6b7280"} />
                        <CustomText variant="body" className="text-gray-500 dark:text-gray-400 ml-1">
                            Joined {joinedDate}
                        </CustomText>
                    </View>
                    
                    {/* Follow/Unfollow Button */}
                    {currentUser?.username !== user?.username && !isGuest &&  (
                        <Button 
                            variant={isFollowing ? "secondary" : "primary"}
                            className="mt-4 min-w-32"
                            onPress={handleFollowToggle}
                            loading={followMutation.isPending || unfollowMutation.isPending}
                            disabled={followMutation.isPending || unfollowMutation.isPending}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                </View>
                
                {/* Stats Cards */}
                <View className="flex-row justify-around bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm mb-6 mt-6">
                    <Pressable 
                        className="items-center" 
                        onPress={() => setActiveTab("posts")}
                    >
                        <CustomText fontFamily={Fonts.Bold} className="text-lg text-gray-900 dark:text-white">
                            {posts?.length || 0}
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
                            {user?.followers?.length || 0}
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
                            {user?.following?.length || 0}
                        </CustomText>
                        <CustomText className="text-gray-500 dark:text-gray-400 text-sm">
                            Following
                        </CustomText>
                    </Pressable>
                </View>
                
                {/* Tabs Navigation */}
                <View className="mb-2 items-center">
                    <Filters
                        options={tabOptions}
                        filter={activeTab}
                        setFilter={(tab) => setActiveTab(tab as ProfileTab)}
                        containerStyleClasses='justify-between flex-1'
                    />
                </View>
                
                {/* Tab Content */}
                {renderTabContent()}
            </ScrollView>
        </ScreenWrapper>
    );
}

// Component for rendering user items in followers/following lists
const UserListItem = ({ user }: { user: FollowFollower }) => {
    const isDark = useColorScheme().colorScheme === "dark";
    const router = useRouter();
    
    return (
        <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-800"
            onPress={() => router.push(`/userProfile?username=${user.username}`)}
        >
            <Avatar uri={user.avatar} className="size-12" />
            <View className="ml-3 flex-1">
                <CustomText fontFamily={Fonts.SemiBold} className="text-gray-900 dark:text-white">
                    {user.username}
                </CustomText>
            </View>
            <Feather name="chevron-right" size={20} color={isDark ? "#9BA1A6" : "#687076"} />
        </TouchableOpacity>
    );
};


