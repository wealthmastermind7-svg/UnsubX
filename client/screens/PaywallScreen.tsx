import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

type Plan = "monthly" | "annual";

export default function PaywallScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { subscriptions } = route.params;
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const buttonScale = useSharedValue(1);

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  const annualSavings = totalMonthly * 12;

  const handleSelectPlan = (plan: Plan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.replace("Savings", { subscriptions });
  };

  const handleRestore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace("Savings", { subscriptions });
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleOpenPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync("https://example.com/privacy");
  };

  const handleOpenTerms = async () => {
    await WebBrowser.openBrowserAsync("https://example.com/terms");
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.headerRow}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={Colors.dark.textSecondary} />
        </Pressable>
        <Pressable onPress={handleRestore}>
          <ThemedText style={styles.restoreText}>Restore</ThemedText>
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
          <ThemedText style={styles.headline}>
            Stop paying for{"\n"}what you don't use
          </ThemedText>
          <ThemedText style={styles.subheadline}>
            Save up to ${annualSavings.toFixed(0)}/year by cancelling unused subscriptions
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="zap" size={20} color={Colors.dark.savings} />
            </View>
            <ThemedText style={styles.featureText}>
              Step-by-step cancellation guides
            </ThemedText>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="bell" size={20} color={Colors.dark.savings} />
            </View>
            <ThemedText style={styles.featureText}>
              Renewal alerts before you're charged
            </ThemedText>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name="trending-up" size={20} color={Colors.dark.savings} />
            </View>
            <ThemedText style={styles.featureText}>
              Track your savings over time
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.plansContainer}>
          <Pressable
            onPress={() => handleSelectPlan("annual")}
            style={[
              styles.planCard,
              selectedPlan === "annual" && styles.planCardSelected,
            ]}
          >
            <View style={styles.bestValueBadge}>
              <ThemedText style={styles.bestValueText}>BEST VALUE</ThemedText>
            </View>
            <View style={styles.planHeader}>
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === "annual" && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === "annual" ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <View style={styles.planInfo}>
                <ThemedText style={styles.planName}>Annual</ThemedText>
                <ThemedText style={styles.planPrice}>$29.99/year</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.planSavings}>
              Save 75% vs monthly
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => handleSelectPlan("monthly")}
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.planCardSelected,
            ]}
          >
            <View style={styles.planHeader}>
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === "monthly" && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === "monthly" ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <View style={styles.planInfo}>
                <ThemedText style={styles.planName}>Monthly</ThemedText>
                <ThemedText style={styles.planPrice}>$9.99/month</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.planTrial}>7-day free trial</ThemedText>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Spacing.lg },
          buttonAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={handleSubscribe}
          onPressIn={() => {
            buttonScale.value = withSpring(0.96);
          }}
          onPressOut={() => {
            buttonScale.value = withSpring(1);
          }}
          style={styles.subscribeButton}
        >
          <ThemedText style={styles.subscribeButtonText}>
            {selectedPlan === "monthly" ? "Start Free Trial" : "Subscribe Now"}
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.legalText}>
          {selectedPlan === "monthly"
            ? "7-day free trial, then $9.99/month. Cancel anytime."
            : "Billed annually at $29.99. Cancel anytime."}
        </ThemedText>
        <View style={styles.legalLinks}>
          <Pressable onPress={handleOpenPrivacyPolicy}>
            <ThemedText style={styles.legalLinkText}>Privacy Policy</ThemedText>
          </Pressable>
          <ThemedText style={styles.legalDivider}>|</ThemedText>
          <Pressable onPress={handleOpenTerms}>
            <ThemedText style={styles.legalLinkText}>Terms of Service</ThemedText>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -Spacing.md,
  },
  restoreText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    marginBottom: Spacing["3xl"],
  },
  headline: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 42,
  },
  subheadline: {
    fontSize: 17,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    marginBottom: Spacing["3xl"],
    gap: Spacing.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(50, 213, 131, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: 16,
    color: Colors.dark.text,
    flex: 1,
  },
  plansContainer: {
    gap: Spacing.md,
  },
  planCard: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    position: "relative",
    overflow: "hidden",
  },
  planCardSelected: {
    borderColor: Colors.dark.savings,
  },
  bestValueBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.dark.savings,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  bestValueText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  radioOuterSelected: {
    borderColor: Colors.dark.savings,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.savings,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  planPrice: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  planSavings: {
    fontSize: 14,
    color: Colors.dark.savings,
    fontWeight: "500",
    marginLeft: 40,
  },
  planTrial: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginLeft: 40,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  subscribeButton: {
    backgroundColor: Colors.dark.savings,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  legalText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  legalLinkText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textDecorationLine: "underline",
  },
  legalDivider: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginHorizontal: Spacing.sm,
  },
});
