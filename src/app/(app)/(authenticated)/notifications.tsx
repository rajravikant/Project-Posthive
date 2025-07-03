import Header from '@/components/navigation/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Avatar from '@/components/ui/Avatar'
import CustomText from '@/components/ui/CustomText'
import { Fonts } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useState } from 'react'
import { Pressable, RefreshControl, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: Date;
  content: string;
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
  postId?: string;
  postTitle?: string;
}

export default function Notifications() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'like':
      case 'comment':
        if (notification.postId) {
          router.push(`/blog/${notification.postId}`);
        }
        break;
      case 'follow':
        if (notification.user?.username) {
          router.push(`/userProfile?username=${notification.user.username}`);
        }
        break;
      default:
        break;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);
    
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ScreenWrapper>
      <Header title="Notifications" buttonBack />
      
      <View className="flex-row justify-between items-center py-3 ">
        <View className="flex-row">
          <Pressable
            className={`px-3 py-1 rounded-full mr-2 ${filter === 'all' ? 'bg-gray-100 dark:bg-neutral-800' : ''}`}
            onPress={() => setFilter('all')}
          >
            <CustomText className={filter === 'all' ? 'text-primary font-OutFit_SemiBold' : 'text-gray-500'}>
              All
            </CustomText>
          </Pressable>
          
          <Pressable
            className={`px-3 py-1 rounded-full flex-row items-center ${filter === 'unread' ? 'bg-gray-100 dark:bg-neutral-800' : ''}`}
            onPress={() => setFilter('unread')}
          >
            <CustomText className={filter === 'unread' ? 'text-primary font-OutFit_SemiBold' : 'text-gray-500'}>
              Unread
            </CustomText>
            {unreadCount > 0 && (
              <View className="bg-primary ml-1 rounded-full w-5 h-5 items-center justify-center">
                <CustomText className="text-white text-xs">
                  {unreadCount}
                </CustomText>
              </View>
            )}
          </Pressable>
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <CustomText className="text-primary font-OutFit_SemiBold">
              Mark all as read
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
      
      {filteredNotifications.length > 0 ? (
        <FlashList
          data={filteredNotifications}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={isDark ? "#fff" : "#000"}
            />
          }
          renderItem={({ item: notification }) => (
            <NotificationItem 
              notification={notification} 
              onPress={() => handleNotificationPress(notification)} 
            />
          )}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-100 dark:bg-neutral-800 " />
          )}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20
          }}
        />
      ) : (
        <EmptyNotifications filter={filter} />
      )}
    </ScreenWrapper>
  );
}

const EmptyNotifications = ({ filter }: { filter: 'all' | 'unread' }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons
        name="notifications-outline"
        size={70}
        color={isDark ? "#6b7280" : "#9ca3af"}
      />
      <CustomText
        fontFamily={Fonts.SemiBold}
        className="text-xl text-gray-800 dark:text-gray-200 mt-4 text-center"
      >
        {filter === 'all' ? "No notifications yet" : "No unread notifications"}
      </CustomText>
      <CustomText className="text-gray-500 dark:text-gray-400 mt-2 text-center">
        {filter === 'all' 
          ? "When you get notifications, they'll appear here" 
          : "All caught up! Check back later for new notifications"}
      </CustomText>
    </View>
  );
};

const NotificationItem = ({ 
  notification, 
  onPress 
}: { 
  notification: Notification;
  onPress: () => void;
}) => {
  
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Ionicons name="heart" size={16} color="#F43F5E" />;
      case 'comment':
        return <Ionicons name="chatbubble" size={16} color="#3B82F6" />;
      case 'follow':
        return <Ionicons name="person-add" size={16} color="#10B981" />;
      case 'mention':
        return <Ionicons name="at" size={16} color="#8B5CF6" />;
      case 'system':
        return <Ionicons name="information-circle" size={16} color="#F59E0B" />;
      default:
        return <Ionicons name="notifications" size={16} color="#6B7280" />;
    }
  };
  
  return (
    <Pressable 
      className={`px-4 py-3 my-2 rounded-md flex-row ${!notification.isRead ? 'bg-gray-200/60 dark:bg-neutral-900' : ''}`}
      onPress={onPress}
    >
      {notification.user ? (
        <Avatar uri={notification.user.avatar} className="size-10" />
      ) : (
        <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
          {getIcon()}
        </View>
      )}
      
      <View className="flex-1 ml-3">
        <CustomText className="text-gray-900 dark:text-gray-100">
          {notification.content}
        </CustomText>
        
        {notification.postTitle && (
          <CustomText 
            className="text-gray-500 dark:text-gray-400 mt-1" 
            numberOfLines={1}
          >
            {notification.postTitle}
          </CustomText>
        )}
        
        <CustomText className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </CustomText>
      </View>
      
      {!notification.isRead && (
        <View className="w-2 h-2 rounded-full bg-primary self-center" />
      )}
    </Pressable>
  );
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    content: 'Sarah Johnson liked your post',
    user: {
      id: 'u1',
      username: 'sarahjohnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    postId: 'post-1',
    postTitle: 'Getting Started with React Native Development',
  },
  {
    id: '2',
    type: 'comment',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    content: 'Michael Chen commented on your post',
    user: {
      id: 'u2',
      username: 'michaelchen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    postId: 'post-2',
    postTitle: 'Understanding TypeScript in React Native',
  },
  {
    id: '3',
    type: 'follow',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    content: 'Emma Wilson started following you',
    user: {
      id: 'u3',
      username: 'emmawilson',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    },
  },
  {
    id: '4',
    type: 'mention',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    content: 'Alex Rodriguez mentioned you in a comment',
    user: {
      id: 'u4',
      username: 'alexrodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    postId: 'post-3',
    postTitle: 'Building Beautiful UIs with NativeWind',
  },
  {
    id: '5',
    type: 'system',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    content: 'Your post has been published successfully',
    postId: 'post-4',
    postTitle: 'The Future of Mobile App Development',
  },
  {
    id: '6',
    type: 'like',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    content: 'David Kim and 5 others liked your post',
    user: {
      id: 'u5',
      username: 'davidkim',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    postId: 'post-5',
    postTitle: 'Optimizing Performance in React Native Apps',
  },
  {
    id: '7',
    type: 'comment',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    content: 'Olivia Thompson replied to your comment',
    user: {
      id: 'u6',
      username: 'oliviathompson',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    postId: 'post-6',
    postTitle: 'Implementing Authentication in React Native',
  }
];