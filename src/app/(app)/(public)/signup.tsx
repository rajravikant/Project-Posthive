import { googleLogin, register } from "@/api/auth";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import InputField from "@/components/ui/InputField";
import { Fonts } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "271833015585-k26t2mhf4s9anght0ljcm9rifb75phdq.apps.googleusercontent.com",
});

interface LoginMutationResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: { userId: string; username: string; avatar: string };
}
const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { colorScheme } = useColorScheme();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (email.trim() === "" || username.trim() === "" || password === "")
      return;

    setIsLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      setIsLoading(false);
      Alert.alert(
        "Success",
        "Account created successfully. You can now log in."
      );
      router.push("/login");
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
          const { accessToken, user, refreshToken } =
            rsp.data as LoginMutationResponse;
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
              entering={FadeInDown.delay(200).duration(1000).springify()}
            >
              <CustomText
                variant="h2"
                fontFamily={Fonts.SemiBold}
                className="dark:text-white text-gray-950 mb-6 "
              >
                Create an Account
              </CustomText>
            </Animated.View>

            <View className="gap-5 w-full">
              <Animated.View
                entering={FadeInUp.delay(400).duration(1000).springify()}
              >
                <InputField
                  placeholder="username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  icon={{
                    color: "white",
                    name: "user",
                    family: "AntDesign",
                    size: 20,
                  }}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(600).duration(1000).springify()}
              >
                <InputField
                  placeholder="email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
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
                entering={FadeInUp.delay(600).duration(1000).springify()}
              >
                <View className="relative w-full">
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
                </View>
              </Animated.View>

              {error && (
                <View className="bg-red-500/20 rounded-lg p-2 mt-1">
                  <Text className="text-red-500 text-xs">{error}</Text>
                </View>
              )}

              <Animated.View
                entering={FadeInUp.delay(800).duration(1000).springify()}
              >
                <Button
                  onPress={handleSignup}
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl mt-4"
                  variant="primary"
                >
                  <CustomText
                    fontFamily={Fonts.SemiBold}
                    className="text-white text-base"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </CustomText>
                </Button>
              </Animated.View>
            </View>

            <Animated.View
              entering={FadeInUp.delay(900).duration(1000).springify()}
              className="mt-8 items-center"
            >
              <CustomText className="dark:text-gray-300 text-gray-600 mb-6">
                Or continue with
              </CustomText>

              <TouchableOpacity
                className="bg-gray-200  dark:bg-neutral-800 items-center p-4 rounded-md mt-6 "
                onPress={handleGoogleLogin}
              >
                <AntDesign
                  name="google"
                  size={24}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Button onPress={() => router.push("/login")} variant="link">
            Already have an account? Login
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupPage;
