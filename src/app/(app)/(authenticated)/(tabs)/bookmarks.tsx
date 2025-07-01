import ScreenWrapper from '@/components/ScreenWrapper'
import CustomText from '@/components/ui/CustomText'
import Icon from '@/components/ui/Icon'
import useAuthStore from '@/store/authStore'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import React, { useRef } from 'react'
import { LayoutAnimation, TouchableOpacity, View } from 'react-native'
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

interface ListItemProps {
  item:string
  id: string;
  onDelete: (slug: string) => void;
}

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

export default function Bookmarks() {
  const {userBookmarks,removeFromBookmark} = useAuthStore()
  const list = useRef<FlashList<{id : string,item:string}> | null>(null);
  

  

  const deleteHandler = (slug: string) => {
    removeFromBookmark(slug)
    list.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    console.log('Deleted bookmark:', slug);
  }

  

const ListItem = ({ item,id,onDelete }: ListItemProps) => {
  const router = useRouter()

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });


  return (
    <Reanimated.View className="dark:bg-neutral-900 bg-white shadow rounded-md " style={[styleAnimation]}>
      <TouchableOpacity style={{width:50,height:50}} onPress={()=>onDelete(item)} className=" justify-center items-center">
        <Icon name="trash" family="Ionicons" size={20} color="red" />
      </TouchableOpacity>
    </Reanimated.View>
  );
  }

  return (
    <ReanimatedSwipeable 
    containerStyle={{height:50,borderRadius:10,marginVertical:5 }}
    friction={2}
    enableTrackpadTwoFingerGesture={true}
    rightThreshold={40}
    renderRightActions={RightAction}
    >
    <TouchableOpacity onPress={()=>router.push(`/blog/${item}`)} className="p-4 bg-gray-200 dark:bg-neutral-800 shadow-sm ">
      <View className="flex-row items-center justify-between">
      <CustomText variant="body">{item}</CustomText>
      <Icon name="chevron-forward" family="Ionicons" size={20} color="#666" />
      </View>
    </TouchableOpacity>
    </ReanimatedSwipeable>
  )
}




  return (
   <ScreenWrapper>
      <CustomText variant='h1'>Your bookmarks </CustomText>

      {userBookmarks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Icon name="bookmarks" family="Ionicons" size={50} color="#999" />
            <CustomText variant="h5" className="mt-4 text-gray-500">
              No Bookmarks Yet
            </CustomText>
            <CustomText
              variant="body"
              className="text-gray-400 text-center mt-2"
            >
              Try exploring posts and bookmarking them for later.
            </CustomText>
          </View>
      ) : (

        <FlashList
          ref={list}
          contentContainerClassName='py-4'
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (<ListItem item={item.item} id={item.id} onDelete={deleteHandler} />)}
          estimatedItemSize={100}
          data={userBookmarks.map((item, index) => {
            return {
              id: Math.random().toString(36).substring(1) + index,
              item: item
            }
          })}
        />
      )}
    </ScreenWrapper>
  )
}


