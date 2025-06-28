
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import useAuthStore from "@/store/authStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    title: "Share Your Story",
    description: "Express yourself and inspire others by publishing your thoughts, experiences, and ideas with a global audience.",
    image: require("../../../assets/images/undraw_publish-article_u3z6.svg"),
  },
  {
    title: "Connect & Discover",
    description: "Follow your favorite writers, explore trending topics, and join a vibrant community of passionate bloggers.",
    image: require("../../../assets/images/undraw_social-share_9clm.svg"),
  },
  {
    title: "Grow Your Influence",
    description: "Build your personal brand, engage with readers, and track your growth as your blog reaches new heights.",
    image: require("../../../assets/images/undraw_font_cooz.svg"),
  },
];

const Onboarding = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const router = useRouter()
  const {onboardingCompleted } = useAuthStore()
  const data = onboardingData[currentStepIndex];
  const handleNext = () => {
    if (currentStepIndex === onboardingData.length - 1) {
      // Navigate to the main app or home screen
      onboardingCompleted(true);
      router.push("/login");
      return;
    }


    if (currentStepIndex < onboardingData.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <ScreenWrapper>
      <View className={`w-full h-full justify-between items-center py-5`}>
        <Animated.View 
        key={currentStepIndex}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)} 
        className="items-center flex-1 justify-center gap-5 ">
          {/* <Image source={data.image} height={50}  /> */}
          <Image source={data.image} style={{ width: 200, height: 200 }} />
          <CustomText fontSize={30} className="text-primary  mb-2.5">{data.title}</CustomText>
          <CustomText variant="h5" className="dark:text-white text-center text-gray-600">
            {data.description}
          </CustomText>
        </Animated.View>

        <View className="flex-row  items-center w-full px-5 gap-5 mt-20">
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onPress={handleBack}
            disabled={currentStepIndex === 0}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1 w-full"
            onPress={handleNext}
          >
            {currentStepIndex < onboardingData.length - 1
              ? "Next"
              : "Get Started"}
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Onboarding;

