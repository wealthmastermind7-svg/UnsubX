import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList, Subscription } from "@/navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Savings">;

function AnimatedSavingsCounter({ value }: { value: number }) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
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
    <ThemedText style={styles.savingsAmount}>
      ${displayAmount.toFixed(0)}
    </ThemedText>
  );
}

function SubscriptionCard({
  subscription,
  index,
  onCancel,
}: {
  subscription: Subscription;
  index: number;
  onCancel: (id: string) => void;
}) {
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

  const handleCancel = () => {
    if (subscription.cancelled) return;

    if (Platform.OS === "web") {
      onCancel(subscription.id);
    } else {
      Alert.alert(
        `Cancel ${subscription.name}?`,
        `This will guide you through cancelling your ${subscription.name} subscription and save you $${subscription.price.toFixed(2)}/month.`,
        [
          { text: "Not Now", style: "cancel" },
          {
            text: "Cancel Subscription",
            style: "destructive",
            onPress: () => onCancel(subscription.id),
          },
        ]
      );
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 60).duration(400)}
      style={animatedStyle}
    >
      <View style={[styles.card, subscription.cancelled && styles.cardCancelled]}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconContainer,
              subscription.cancelled && styles.iconContainerCancelled,
            ]}
          >
            <Feather
              name={iconMap[subscription.icon] || "circle"}
              size={24}
              color={subscription.cancelled ? Colors.dark.savings : Colors.dark.text}
            />
          </View>
          <View style={styles.cardInfo}>
            <ThemedText
              style={[
                styles.cardName,
                subscription.cancelled && styles.cardNameCancelled,
              ]}
            >
              {subscription.name}
            </ThemedText>
            <ThemedText style={styles.cardCategory}>
              {subscription.cancelled ? "Cancelled" : subscription.category}
            </ThemedText>
          </View>
          <View style={styles.cardPriceContainer}>
            <ThemedText
              style={[
                styles.cardPrice,
                subscription.cancelled && styles.cardPriceCancelled,
              ]}
            >
              ${subscription.price.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.cardPeriod}>/mo</ThemedText>
          </View>
        </View>
        <Pressable
          onPress={handleCancel}
          onPressIn={() => {
            if (!subscription.cancelled) {
              scale.value = withSpring(0.98);
            }
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          disabled={subscription.cancelled}
          style={[
            styles.cancelButton,
            subscription.cancelled && styles.cancelButtonDone,
          ]}
        >
          {subscription.cancelled ? (
            <View style={styles.cancelledRow}>
              <Feather name="check" size={18} color={Colors.dark.savings} />
              <ThemedText style={styles.cancelledText}>Saved</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.cancelButtonText}>
              Cancel & Save ${subscription.price.toFixed(2)}/mo
            </ThemedText>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function SavingsScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const { subscriptions: initialSubscriptions } = route.params;
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

  const handleCancel = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, cancelled: true } : sub
      )
    );
  };

  const cancelledSubs = subscriptions.filter((s) => s.cancelled);
  const activeSubs = subscriptions.filter((s) => !s.cancelled);
  const totalSaved = cancelledSubs.reduce((sum, sub) => sum + sub.price, 0);
  const totalActive = activeSubs.reduce((sum, sub) => sum + sub.price, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <ThemedText style={styles.headerLabel}>
          {totalSaved > 0 ? "You're saving" : "Your subscriptions"}
        </ThemedText>
        {totalSaved > 0 ? (
          <View style={styles.savingsContainer}>
            <AnimatedSavingsCounter value={totalSaved} />
            <ThemedText style={styles.savingsPeriod}>/month</ThemedText>
          </View>
        ) : (
          <ThemedText style={styles.savingsHint}>
            Cancel subscriptions to start saving
          </ThemedText>
        )}
        <ThemedText style={styles.headerSubtext}>
          {cancelledSubs.length} cancelled
          {activeSubs.length > 0
            ? ` • ${activeSubs.length} active ($${totalActive.toFixed(0)}/mo)`
            : ""}
        </ThemedText>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {cancelledSubs.length > 0 ? (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Cancelled</ThemedText>
            {cancelledSubs.map((subscription, index) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                index={index}
                onCancel={handleCancel}
              />
            ))}
          </View>
        ) : null}

        {activeSubs.length > 0 ? (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Active Subscriptions</ThemedText>
            {activeSubs.map((subscription, index) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                index={cancelledSubs.length + index}
                onCancel={handleCancel}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
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
    color: Colors.dark.savings,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  savingsAmount: {
    fontSize: 72,
    fontWeight: "700",
    color: Colors.dark.savings,
    letterSpacing: -2,
  },
  savingsPeriod: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.dark.savings,
    marginLeft: Spacing.xs,
  },
  savingsHint: {
    fontSize: 17,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
  },
  headerSubtext: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: Spacing.md,
  },
  cardCancelled: {
    borderColor: "rgba(50, 213, 131, 0.3)",
    backgroundColor: "rgba(50, 213, 131, 0.08)",
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
  iconContainerCancelled: {
    backgroundColor: "rgba(50, 213, 131, 0.15)",
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
  cardNameCancelled: {
    textDecorationLine: "line-through",
    opacity: 0.7,
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
  cardPriceCancelled: {
    color: Colors.dark.savings,
    textDecorationLine: "line-through",
  },
  cardPeriod: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginLeft: 2,
  },
  cancelButton: {
    backgroundColor: Colors.dark.waste,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  cancelButtonDone: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.dark.savings,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelledRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  cancelledText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.savings,
  },
});
