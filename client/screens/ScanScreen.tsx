import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  FadeIn,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";
import { RootStackParamList, Subscription } from "@/navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Scan">;

const scanMessages = [
  "Finding hidden subscriptions...",
  "Checking payment history...",
  "Analyzing recurring charges...",
  "Identifying forgotten services...",
  "Calculating monthly waste...",
];

const mockSubscriptions: Subscription[] = [
  { id: "1", name: "Netflix", price: 15.99, icon: "film", category: "Entertainment", cancelled: false },
  { id: "2", name: "Spotify", price: 9.99, icon: "music", category: "Music", cancelled: false },
  { id: "3", name: "iCloud+", price: 2.99, icon: "cloud", category: "Storage", cancelled: false },
  { id: "4", name: "Adobe CC", price: 54.99, icon: "edit-3", category: "Creative", cancelled: false },
  { id: "5", name: "Dropbox", price: 11.99, icon: "hard-drive", category: "Storage", cancelled: false },
  { id: "6", name: "HBO Max", price: 15.99, icon: "tv", category: "Entertainment", cancelled: false },
  { id: "7", name: "Disney+", price: 7.99, icon: "star", category: "Entertainment", cancelled: false },
  { id: "8", name: "YouTube Premium", price: 13.99, icon: "youtube", category: "Entertainment", cancelled: false },
  { id: "9", name: "LinkedIn Premium", price: 29.99, icon: "linkedin", category: "Career", cancelled: false },
  { id: "10", name: "Headspace", price: 12.99, icon: "heart", category: "Wellness", cancelled: false },
];

export default function ScanScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [messageIndex, setMessageIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(1);
  const pulseScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      textOpacity.value = withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
      setMessageIndex((prev) => (prev + 1) % scanMessages.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDotsCount((prev) => (prev % 3) + 1);
    }, 500);

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const hapticInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1500);

    const navigateTimeout = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.replace("Results", { subscriptions: mockSubscriptions });
    }, 6000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
      clearInterval(hapticInterval);
      clearTimeout(navigateTimeout);
    };
  }, [navigation]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing["4xl"], paddingBottom: insets.bottom + Spacing.xl }]}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <Animated.View style={[styles.pulseContainer, pulseStyle]}>
          <View style={styles.innerCircle}>
            <View style={styles.coreCircle} />
          </View>
        </Animated.View>

        <Animated.View style={textStyle}>
          <ThemedText style={styles.scanText}>
            {scanMessages[messageIndex].replace("...", ".".repeat(dotsCount))}
          </ThemedText>
        </Animated.View>

        <ThemedText style={styles.subText}>
          This may take a moment
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 77, 77, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  coreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.dark.waste,
  },
  scanText: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  subText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
});
