import React from 'react';
import { View } from 'react-native';
export const BlogSkeleton: React.FC = () => {
    return (
        <View className="px-5 pt-safe bg-background dark:bg-backgroundDark flex-1 ">
            <View className="w-full h-64 bg-gray-300 animate-pulse dark:bg-neutral-950 rounded-lg mb-6" />

            <View className="h-8 bg-gray-300 animate-pulse dark:bg-neutral-950 rounded-lg w-3/4 mb-4" />

            <View className="h-5 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-1/2 mb-6" />

            <View className="gap-4">
            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-full" />
            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-10/12" />
            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-8/12" />

            <View className="w-full h-48 bg-gray-300 animate-pulse dark:bg-neutral-950 rounded-lg my-6" />

            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-4/5" />
            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-3/4" />
            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-8/12" />

            <View className="w-full h-40 bg-gray-300 animate-pulse   dark:bg-neutral-950 rounded-lg my-6" />

            <View className="h-4 bg-gray-200    animate-pulse dark:bg-neutral-900 rounded-lg w-10/12" />
            <View className="h-4 bg-gray-200 animate-pulse dark:bg-neutral-900 rounded-lg w-1/2" />
            </View>
        </View>
    );
};


export const SingleBlogSkeleton: React.FC = () => {
    return (
         <View className="rounded-xl h-40 p-4 mb-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center gap-4">
            {/* Image Skeleton */}
            <View className="size-32 rounded-xl bg-gray-300 dark:bg-neutral-950 animate-pulse" />
            <View className="flex-1 justify-around h-full">
                {/* Title Skeleton */}
                <View className="h-6 bg-gray-300 dark:bg-neutral-950 rounded w-3/4 mb-2 animate-pulse" />
                {/* Meta Skeleton */}
                <View className="flex-row items-center gap-2 mt-1">
                    <View className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse" />
                    <View className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse" />
                </View>
            </View>
        </View>
    </View>
    );
}




export const RecommendationSkeleton: React.FC = () => {
    return (
        <View >            
                <View className="h-64  bg-gray-300 dark:bg-neutral-950 rounded-lg animate-pulse" />
        </View>
    );
};

