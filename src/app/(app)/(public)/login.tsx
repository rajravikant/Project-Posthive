import { googleLogin, loginUser } from "@/api/auth";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import InputField from "@/components/ui/InputField";
import { Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { AntDesign, Ionicons, Zocial } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
});

interface LoginMutationResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: { userId: string; username: string; avatar: string };
  // existingUser: Creator;
}

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { colorScheme } = useColorScheme();
  const { login, loginAsGuest } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (identifier.trim() === "" || password === "") return;
    setIsLoading(true);
    try {
      const response = await loginUser(identifier.trim(), password);
      setIsLoading(false);

      if (response.status === 200) {
        const { accessToken, user, refreshToken } =
          response.data as LoginMutationResponse;
        login({
          currentUser : user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      }
    } catch (error) {
      setError("Invalid username or password");
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Google Sign In Button Pressed");

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const rsp = await googleLogin(
          response.data.user.email,
          response.data.user.photo!,
          response.data.user.name!
        );

        if (rsp.status === 200) {
          const { accessToken, user, refreshToken } = rsp.data as LoginMutationResponse;
          login({
            currentUser: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        }
      } else {
        console.log("Cancelled by user or error occurred");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Operation in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Play Services not available");
            break;
          default:
            Alert.alert("An error occurred");
        }
      } else {
        Alert.alert("An unexpected error occurred");
        console.log(error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-between pb-5">
          <View className="flex-row pt-8 px-5 items-center">
            <BackButton router={router} />
          </View>

          <View className="w-full px-5 justify-end mb-6">
            <Animated.View
              entering={FadeInUp.delay(200).duration(1000).springify()}
            >
              <CustomText
                variant="h2"
                fontFamily={Fonts.SemiBold}
                className="dark:text-white text-gray-950 "
              >
                Welcome Back
              </CustomText>

              <CustomText
                variant="body"
                className="dark:text-gray-300  text-gray-600 mb-10"
              >
                Login to your account to continue
              </CustomText>
            </Animated.View>

            <View className="gap-5 w-full">
              <Animated.View
                entering={FadeInDown.delay(400).duration(1000).springify()}
              >
                <InputField
                  placeholder="email or username"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  icon={{
                    color: "white",
                    name: "mail",
                    family: "AntDesign",
                    size: 20,
                  }}
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="relative w-full"
              >
                <InputField
                  placeholder="Password"
                  value={password}
                  autoCapitalize="none"
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  icon={{
                    color: "white",
                    name: "lock",
                    family: "AntDesign",
                    size: 20,
                  }}
                />
                <TouchableOpacity
                  className="absolute right-4 top-5"
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons
                    name={secureTextEntry ? "eye-off" : "eye"}
                    size={22}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </TouchableOpacity>
              </Animated.View>

              {error && (
                <View className="bg-red-500/20 rounded-lg p-2 mt-1">
                  <Text className="text-red-500 text-xs">{error}</Text>
                </View>
              )}

              <Animated.View
                entering={FadeInDown.delay(800).duration(1000).springify()}
              >
                <Button
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl mt-4"
                  variant="primary"
                >
                  <CustomText
                    fontFamily={Fonts.SemiBold}
                    className="text-white text-base"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </CustomText>
                </Button>
              </Animated.View>
            </View>

            <Animated.View
              entering={FadeInDown.delay(900).duration(1000).springify()}
              className="mt-8 items-center"
            >
              <CustomText className="dark:text-gray-300 text-gray-600 mb-6">
                Or continue with
              </CustomText>

              <View className="gap-4 flex-row items-center justify-between">
                <TouchableOpacity
                  className="bg-gray-200 dark:bg-neutral-800 items-center p-2 rounded-md flex-1"
                  onPress={handleGoogleLogin}
                >
                  <AntDesign
                    name="google"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-200 dark:bg-neutral-800 items-center p-2 rounded-md flex-1"
                  onPress={handleGuestLogin}
                >
                  <Zocial
                    name="guest"
                    size={21}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

          <Button onPress={() => router.push("/signup")} variant="link">
            Don't have an account? Sign Up
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
