import CustomText from '@/components/ui/CustomText';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
type BlogCardProps = {
    title: string;
    imageUrl: string;
    author: string;
    onPress?: () => void;
};

const BlogCard: React.FC<BlogCardProps> = ({
    title,
    imageUrl,
    author,
    onPress,
}) => (
    <TouchableOpacity
        className="bg-white relative mx-6 first:ml-0 rounded-xl  shadow-sm  overflow-hidden"
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View className='h-[21rem] w-[200px] '>
        <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
        />
            <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.99)"]} className="p-4 absolute -bottom-2 left-0 right-0  ">
            <CustomText variant='h4' className="mb-2 text-white">{title}</CustomText>
                <CustomText variant='body' className='text-white' >{author}</CustomText>
        </LinearGradient>

        </View>
    </TouchableOpacity>
);

export default BlogCard;