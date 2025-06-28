import { getNewAccessToken } from "@/api/auth";
import NetInfoComponent from "@/components/NetInfo";
import "@/global.css";
import useAuthStore, { setAccessTokenInStore } from "@/store/authStore";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Alert, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


SplashScreen.preventAutoHideAsync();


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const InitialLayout = () => {
  useReactQueryDevTools(queryClient);
  
  const router = useRouter()
  const [loaded, error] = useFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
  });
  const { accessToken, refreshToken, currentUser, logout } = useAuthStore();

  const checkToken = async () => {
    if (accessToken && currentUser && refreshToken) {
      console.log("Checking token validity...");
      
      try {
        const decodedAccessToken = jwtDecode<{ exp: number }>(accessToken);
        const decodedRefreshToken = jwtDecode<{ exp: number }>(refreshToken);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        
        if (decodedRefreshToken.exp < currentTime) {
          console.log("Refresh token expired");
          Alert.alert("Session Expired", "Your session has expired. Please login again.");
          logout();
          router.replace("/login");
          return;
        }

        if (decodedAccessToken.exp < currentTime) {
          // If access token is expired, refresh it
          console.log("Access token expired, refreshing...");
          try {
            const newAccessToken = await getNewAccessToken(refreshToken);
            setAccessTokenInStore(newAccessToken);
            console.log("Access token refreshed successfully");
          } catch (error) {
            console.error("Failed to refresh access token:", error);
            Alert.alert("Error", "Failed to refresh access token. Please login again.");
            logout();
            router.replace("/login");
          }
          return;
        }

        // If both tokens are valid, show remaining epoch time into seconds
        const accessTokenRemainingTime = decodedAccessToken.exp - currentTime;
        const refreshTokenRemainingTime = decodedRefreshToken.exp - currentTime;
        console.log("Access Token Remaining Time:", accessTokenRemainingTime, "seconds");
        console.log("Refresh Token Remaining Time:", refreshTokenRemainingTime, "seconds");
      } catch (error) {
        console.error("Error decoding tokens:", error);
        logout();
        router.replace("/login");
      }
    }
  };

  useEffect(() => {
    // Only proceed when fonts are loaded
    if (loaded) {
      // Only check token once when fonts are loaded
      checkToken()
        .then(() => {
          SplashScreen.hideAsync();
        })
        .catch(error => {
          console.error("Error during token check:", error);
          SplashScreen.hideAsync();
        });
    }
  }, [loaded]);

  if (!loaded || error) {
    return null;
  }
  return <Slot />;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
           <NetInfoComponent/>
          <InitialLayout />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
