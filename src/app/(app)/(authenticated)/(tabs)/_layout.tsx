import { Colors } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const {isGuest,userBookmarks} = useAuthStore()
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        animation:"fade",
        tabBarActiveTintColor : Colors.primary,
        tabBarBadgeStyle:{
          backgroundColor: Colors.primary,
          color: "white",
          fontFamily:"Outfit-Regular",
          fontSize: 10,
        }
      }}
    >
      <Tabs.Screen
        name="index"  
        options={{
          title: "Home",
          tabBarIcon : (props) => <Feather name="home" size={24} color={props.color} />
         
        }}
      />
   
      <Tabs.Screen
        name="addpost"
        options={{
          title: "New Post",
          href :  isGuest ? null : '/addpost',
          tabBarIcon : (props) => <Feather name="plus-circle" size={24} color={props.color} />
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Saved",
          tabBarBadge: userBookmarks.length > 0 ? userBookmarks.length : undefined,
          tabBarIcon : (props) => <Feather name="bookmark" size={24} color={props.color} />
         
        }}
      />

      <Tabs.Screen
        name="userblogs"
        options={{
          title: "My Blogs",
          href : isGuest ? null : '/userblogs',
          tabBarIcon : (props) => <Feather name="book" size={24} color={props.color} />
        }}
      />
    </Tabs>
  );
}
