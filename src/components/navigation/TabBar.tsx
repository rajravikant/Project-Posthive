import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import TabBarButton, { RouteName } from './TabBarButton';


export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    const buttonWidth = dimensions.width / state.routes.length;

    const onLayout = (e:LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setDimensions({ width, height });
    }
   
    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(()=>{
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    })
  return (
    <View onLayout={onLayout} className='absolute flex-row bottom-5 py-4 rounded-full shadow-2xl justify-between items-center mx-10 bg-white dark:bg-neutral-900'>
      <Animated.View style={[{
        position: 'absolute',
        backgroundColor: '#4A90E2',
        height: dimensions.height - 15,
        width : buttonWidth - 25,
        marginHorizontal: 10,
        borderRadius : 50, 
      },animatedStyle]}/>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;


        const onPress = () => {
        tabPositionX.value = withSpring(buttonWidth * index,{duration : 1500})
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
         <TabBarButton 
         key={route.key} 
         onPress={onPress} 
         onLongPress={onLongPress}  
         isFocused={isFocused}
         routeName={route.name as RouteName}
         label={label}
        options={options}
          />
        );
      })}
    </View>
  );
}