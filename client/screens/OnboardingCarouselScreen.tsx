import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeInDown,
  SharedValue,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingCarousel">;

const { width: screenWidth } = Dimensions.get("window");

const onboardingImages = {
  discover: require("../assets/onboarding/01.png"),
  waste: require("../assets/onboarding/03.png"),
  cancel: require("../assets/onboarding/05.png"),
  savings: require("../assets/onboarding/06.png"),
};

const slides = [
  {
    id: 1,
    title: "Discover\nunused\nsubscriptions",
    image: onboardingImages.discover,
    color: Colors.dark.text,
  },
  {
    id: 2,
    title: "See your subscription ",
    subtitle: "waste",
    subtitleColor: Colors.dark.waste,
    image: onboardingImages.waste,
  },
  {
    id: 3,
    title: "Cancel\nsubscriptions\neasily",
    image: onboardingImages.cancel,
    color: Colors.dark.text,
  },
  {
    id: 4,
    title: "Track your ",
    subtitle: "savings",
    subtitleColor: Colors.dark.savings,
    image: onboardingImages.savings,
  },
];

export default function OnboardingCarouselScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / screenWidth);
    if (index !== currentSlide) {
      setCurrentSlide(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scrollViewRef.current?.scrollTo({
        x: (currentSlide + 1) * screenWidth,
        animated: true,
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.replace("OnboardingQuestion");
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace("OnboardingQuestion");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <ThemedText style={styles.skipText}>Skip</ThemedText>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <CarouselSlide
            key={slide.id}
            slide={slide}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.indicators}>
          {slides.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentSlide
                      ? Colors.dark.savings
                      : Colors.dark.textSecondary,
                  opacity: index === currentSlide ? 1 : 0.5,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={styles.nextButton}
        >
          <ThemedText style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

function CarouselSlide({
  slide,
  index,
  scrollX,
}: {
  slide: (typeof slides)[0];
  index: number;
  scrollX: SharedValue<number>;
}) {
  const insets = useSafeAreaInsets();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [screenWidth * 0.3, 0, -screenWidth * 0.3],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, -30],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={[styles.slide, { paddingTop: insets.top + Spacing["2xl"] }]}>
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        {slide.subtitle ? (
          <>
            <ThemedText style={styles.slideTitle}>{slide.title}</ThemedText>
            <ThemedText
              style={[
                styles.slideTitle,
                { color: slide.subtitleColor },
              ]}
            >
              {slide.subtitle}
            </ThemedText>
          </>
        ) : (
          <ThemedText style={[styles.slideTitle, { color: slide.color }]}>
            {slide.title}
          </ThemedText>
        )}
      </Animated.View>

      <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
        <Image
          source={slide.image}
          style={styles.slideImage}
          resizeMode="contain"
        />
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  skipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  textContainer: {
    alignItems: "flex-start",
    width: "100%",
  },
  slideTitle: {
    fontSize: 44,
    fontWeight: "700",
    lineHeight: 52,
    color: Colors.dark.text,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  slideImage: {
    width: 280,
    height: 450,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.textSecondary,
  },
  nextButton: {
    backgroundColor: Colors.dark.savings,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
