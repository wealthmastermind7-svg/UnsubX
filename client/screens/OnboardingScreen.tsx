import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const subscriptionOptions = [
  { label: "1-3", value: 2 },
  { label: "4-6", value: 5 },
  { label: "7-10", value: 8 },
  { label: "10+", value: 12 },
];

export default function OnboardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const buttonScale = useSharedValue(1);

  const handleSelect = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(value);
  };

  const handleContinue = () => {
    if (selectedOption !== null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("Scan", { estimatedCount: selectedOption });
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing["4xl"], paddingBottom: insets.bottom + Spacing.xl }]}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.appName}>SubKillX</ThemedText>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.content}>
        <ThemedText style={styles.question}>
          How many subscriptions do you think you're paying for?
        </ThemedText>

        <View style={styles.optionsContainer}>
          {subscriptionOptions.map((option, index) => (
            <Animated.View
              key={option.value}
              entering={FadeIn.delay(300 + index * 100).duration(400)}
            >
              <Pressable
                onPress={() => handleSelect(option.value)}
                style={[
                  styles.optionButton,
                  selectedOption === option.value && styles.optionButtonSelected,
                ]}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    selectedOption === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(700).duration(400)} style={styles.footer}>
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={selectedOption === null}
            style={[
              styles.continueButton,
              selectedOption === null && styles.continueButtonDisabled,
            ]}
          >
            <ThemedText style={styles.continueText}>Find My Subscriptions</ThemedText>
          </Pressable>
        </Animated.View>
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
  header: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  question: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: Spacing["4xl"],
    lineHeight: 36,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.dark.backgroundDefault,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    minWidth: 100,
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: Colors.dark.waste,
    borderColor: Colors.dark.waste,
  },
  optionText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  footer: {
    paddingTop: Spacing.xl,
  },
  continueButton: {
    backgroundColor: Colors.dark.text,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    opacity: 0.3,
  },
  continueText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.dark.backgroundRoot,
  },
});
