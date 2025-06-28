import { addNetworkStateListener, getNetworkStateAsync, NetworkState } from 'expo-network';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import CustomText from './ui/CustomText';
import Icon from './ui/Icon';


export default function NetInfoComponent() {
    const [connectionInfo, setConnectionInfo] = useState<NetworkState | null>(null);
    const [visible, setVisible] = useState(false);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    // Animation values
    const translateY = useSharedValue(100);
    const opacity = useSharedValue(0);
    
    // Function to show/hide the network alert
    const updateVisibility = (isConnected: boolean) => {
      // If offline, show the alert
      if (!isConnected) {
        setVisible(true);
        translateY.value = withSequence(
          withTiming(0, { duration: 400 }),
          withDelay(
            5000, // Keep visible for 5 seconds if offline
            withTiming(100, { duration: 500 }, () => {
              runOnJS(setVisible)(false);
            })
          )
        );
        opacity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(5000, withTiming(0, { duration: 300 }))
        );
      } else if (connectionInfo?.isConnected === false) {
        // Only show "back online" notification if we were previously offline
        setVisible(true);
        translateY.value = withSequence(
          withTiming(0, { duration: 400 }),
          withDelay(
            3000, // Show "online" message for 3 seconds
            withTiming(100, { duration: 500 }, () => {
              runOnJS(setVisible)(false);
            })
          )
        );
        opacity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(3000, withTiming(0, { duration: 300 }))
        );
      }
    };
    
    useEffect(() => {
      // Get initial network state when component mounts
      const getInitialNetworkState = async () => {
        try {
          const networkState = await getNetworkStateAsync();
          setConnectionInfo(networkState);
          
          // Only show alert if offline on initial load
          if (!networkState.isConnected) {
            updateVisibility(false);
          }
        } catch (error) {
          console.error('Failed to get network state:', error);
        }
      };
      
      getInitialNetworkState();
      
      // Subscribe to network changes
      const unsubscribe = addNetworkStateListener((state) => {
        console.log('Network state changed:', state.isConnected);
        setConnectionInfo(prevState => {
          // Only update visibility if network state actually changed
          if (prevState?.isConnected !== state.isConnected) {
            updateVisibility(state.isConnected === true);
          }
          return state;
        });
      });

      return () => {
        unsubscribe.remove();
      };
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
      };
    });

    if (!visible) return null;

    const isConnected = connectionInfo?.isConnected;
    
    return (
      <Animated.View 
        style={[
          styles.container, 
          animatedStyle,
          isDark 
            ? isConnected ? styles.onlineDark : styles.offlineDark
            : isConnected ? styles.onlineLight : styles.offlineLight
        ]}
      >
        <Icon 
          name={isConnected ? "wifi" : "wifi-off"} 
          family="Ionicons" 
          size={20} 
          color="#fff" 
        />
        <CustomText variant="body" className="text-white ml-2 font-bold">
          {isConnected 
            ? 'Back Online' 
            : 'No Internet Connection'
          }
        </CustomText>
      </Animated.View>
    );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  offlineLight: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)', // red-500 with opacity
  },
  offlineDark: {
    backgroundColor: 'rgba(185, 28, 28, 0.95)', // red-700 with opacity
  },
  onlineLight: {
    backgroundColor: 'rgba(34, 197, 94, 0.95)', // green-500 with opacity
  },
  onlineDark: {
    backgroundColor: 'rgba(21, 128, 61, 0.95)', // green-700 with opacity
  }
});