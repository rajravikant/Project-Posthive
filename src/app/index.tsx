import useAuthStore from "@/store/authStore";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const {isOnboardingCompleted} = useAuthStore()
  return <Redirect href={isOnboardingCompleted ? "/welcome" : "/onboarding"} />;
}

