import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
  runOnJS,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList, Subscription } from "@/navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

function AnimatedCounter({ value }: { value: number }) {
  const displayValue = useSharedValue(0);
  const [displayAmount, setDisplayAmount] = React.useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayAmount(value);
        clearInterval(interval);
      } else {
        setDisplayAmount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <ThemedText style={styles.counterAmount}>
      ${displayAmount.toFixed(0)}
    </ThemedText>
  );
}

function SubscriptionCard({ subscription, index }: { subscription: Subscription; index: number }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconMap: { [key: string]: keyof typeof Feather.glyphMap } = {
    film: "film",
    music: "music",
    cloud: "cloud",
    "edit-3": "edit-3",
    "hard-drive": "hard-drive",
    tv: "tv",
    star: "star",
    youtube: "youtube",
    linkedin: "linkedin",
    heart: "heart",
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 80).duration(400)}
      style={animatedStyle}
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Feather
              name={iconMap[subscription.icon] || "circle"}
              size={24}
              color={Colors.dark.text}
            />
          </View>
          <View style={styles.cardInfo}>
            <ThemedText style={styles.cardName}>{subscription.name}</ThemedText>
            <ThemedText style={styles.cardCategory}>{subscription.category}</ThemedText>
          </View>
          <View style={styles.cardPriceContainer}>
            <ThemedText style={styles.cardPrice}>
              ${subscription.price.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.cardPeriod}>/mo</ThemedText>
          </View>
        </View>
        <View style={styles.cancelButtonContainer}>
          <BlurView intensity={20} style={styles.blurOverlay}>
            <Feather name="lock" size={16} color={Colors.dark.textSecondary} />
          </BlurView>
          <View style={styles.cancelButton}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ResultsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { subscriptions } = route.params;
  const buttonScale = useSharedValue(1);

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  const handleUnlock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Paywall", { subscriptions });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <ThemedText style={styles.headerLabel}>You're leaking</ThemedText>
        <View style={styles.counterContainer}>
          <AnimatedCounter value={totalMonthly} />
          <ThemedText style={styles.counterPeriod}>/month</ThemedText>
        </View>
        <ThemedText style={styles.headerSubtext}>
          on {subscriptions.length} active subscriptions
        </ThemedText>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {subscriptions.map((subscription, index) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            index={index}
          />
        ))}
      </ScrollView>

      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Spacing.xl },
          buttonAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={handleUnlock}
          onPressIn={() => {
            buttonScale.value = withSpring(0.96);
          }}
          onPressOut={() => {
            buttonScale.value = withSpring(1);
          }}
          style={styles.unlockButton}
        >
          <ThemedText style={styles.unlockButtonText}>
            Unlock Cancellation Tools
          </ThemedText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },
  headerLabel: {
    fontSize: 18,
    color: Colors.dark.waste,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  counterAmount: {
    fontSize: 72,
    fontWeight: "700",
    color: Colors.dark.waste,
    letterSpacing: -2,
  },
  counterPeriod: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.dark.waste,
    marginLeft: Spacing.xs,
  },
  headerSubtext: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  cardPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark.waste,
  },
  cardPeriod: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginLeft: 2,
  },
  cancelButtonContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8, 9, 12, 0.7)",
  },
  cancelButton: {
    backgroundColor: Colors.dark.backgroundSecondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.textSecondary,
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
  unlockButton: {
    backgroundColor: Colors.dark.text,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.dark.backgroundRoot,
  },
});
