import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useScreenOptions } from "@/hooks/useScreenOptions";

import OnboardingCarouselScreen from "@/screens/OnboardingCarouselScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import ScanScreen from "@/screens/ScanScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import PaywallScreen from "@/screens/PaywallScreen";
import SavingsScreen from "@/screens/SavingsScreen";

export type RootStackParamList = {
  OnboardingCarousel: undefined;
  OnboardingQuestion: undefined;
  Scan: { estimatedCount: number };
  Results: { subscriptions: Subscription[] };
  Paywall: { subscriptions: Subscription[] };
  Savings: { subscriptions: Subscription[] };
};

export type Subscription = {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: string;
  cancelled: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
        contentStyle: {
          backgroundColor: "#08090C",
        },
        animation: "fade",
      }}
    >
      <Stack.Screen name="OnboardingCarousel" component={OnboardingCarouselScreen} />
      <Stack.Screen name="OnboardingQuestion" component={OnboardingScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="Savings" component={SavingsScreen} />
    </Stack.Navigator>
  );
}
