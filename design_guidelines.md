# SubKillX Design Guidelines

## App Purpose
A premium financial utility app that helps users identify and eliminate wasted subscription spending. The tone is serious, premium, and empowering—designed to feel like a paid finance tool, not a gimmick.

## Authentication
No authentication required. This is a single-user utility app with local data storage.

## Navigation Architecture
**Stack-Only Navigation** - Linear flow from onboarding to paywall to savings tracking:
1. Onboarding Screen
2. Scan Screen
3. Results Screen (Locked)
4. Paywall Screen
5. Savings Screen (Unlocked after purchase)

## Visual Design System

### Color Palette
- **Background**: Near-black charcoal `#08090C`
- **Glass Cards**: Frosted white at 18% opacity (using expo-blur)
- **Accent Colors**:
  - Red for waste: `#FF4D4D`
  - Green for savings: `#32D583`

### Typography
- **Headings**: Retrola Ink typeface (custom font)
- **Large Currency Figures**: 72px+ for oversized money counters
- **Design Language**: Editorial finance aesthetic with strong contrast, minimal clutter, Apple-inspired spacing

### Design Principles
- Glassmorphism throughout (frosted glass cards)
- Bold, large typography for financial impact
- High contrast for readability
- Intentional, conversion-focused layout
- Premium, serious aesthetic

## Screen Specifications

### 1. Onboarding Screen
- **Purpose**: Qualify user and set expectations
- **Layout**: 
  - Single question centered: "How many subscriptions do you think you're paying for?"
  - Number selection interface
  - Transparent header
  - Scrollable: No
- **Haptics**: Light haptic feedback on number selection
- **Components**: Number picker/selector, glass card background

### 2. Scan Screen
- **Purpose**: Create anticipation and perceived value
- **Layout**:
  - Animated scanning text: "Finding hidden subscriptions…"
  - Loading state with animation
  - Transparent header
  - Scrollable: No
- **Haptics**: Medium haptic pulse during scan animation
- **Components**: Animated text, loading indicator

### 3. Results Screen (LOCKED)
- **Purpose**: Show value proposition before paywall
- **Layout**:
  - Oversized money counter at top: "$247 / month" (72px+)
  - Scrollable list of glass cards showing individual subscriptions
  - Cancel buttons on each card are blurred and disabled
  - Transparent header
  - Scrollable: Yes
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: insets.bottom + Spacing.xl
- **Visual Treatment**:
  - Red accent `#FF4D4D` highlights for leaked money
  - Glass cards fade and slide in
  - Disabled state uses blur effect
- **Components**: Money counter, subscription cards with blur overlay, disabled cancel buttons

### 4. Paywall Screen
- **Purpose**: Convert to premium subscription
- **Layout**:
  - Headline: "Stop paying for what you don't use"
  - Plan cards (glass design):
    - Monthly: $9.99 (7-day free trial)
    - Annual: $29.99 (Best Value badge)
  - CTA button below plans
  - Privacy/terms links at bottom
  - Transparent header
  - Scrollable: Yes if needed
- **Haptics**: Medium haptic on plan selection
- **Visual Treatment**:
  - Serious, premium transition (not playful)
  - Best Value badge uses green accent
  - Strong visual hierarchy
- **Components**: Plan selection cards, CTA button, legal links

### 5. Savings Screen (UNLOCKED)
- **Purpose**: Track cancelled subscriptions and show savings
- **Layout**:
  - Green animated savings counter at top: "$XXX saved"
  - Scrollable list of cancelled subscriptions
  - Active cancel buttons (glass style)
  - Transparent header
  - Scrollable: Yes
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: insets.bottom + Spacing.xl
- **Haptics**: 
  - Light haptic on navigation
  - Heavy haptic on successful cancellation
- **Visual Treatment**:
  - Green accent `#32D583` for savings
  - Counter animates upward on reveal
  - Success states feel rewarding
- **Components**: Animated money counter, subscription cards, cancel buttons

## Animation Specifications
- **Money Counters**: Animate upward with counting effect
- **Glass Cards**: Fade and slide transitions
- **Paywall Transitions**: Serious, smooth (not bouncy or playful)
- **Scanning Animation**: Pulsing or progressive text effect
- Use `react-native-reanimated` for all animations

## Haptic Feedback System
- **Light**: Navigation between screens
- **Medium**: Scan pulse, paywall plan selection, savings reveal
- **Heavy**: Successful cancellation action
- Implement using `expo-haptics`

## Monetization (RevenueCat)
- **Entitlement**: `premium_access`
- **Products**:
  - `subkillx_monthly`: $9.99/month (7-day free trial)
  - `subkillx_annual`: $29.99/year (no trial, best value)
- Weekly plan intentionally hidden
- Gates cancellation guides, tracking, and alerts

## Accessibility
- High contrast maintained throughout (white on dark)
- Large touch targets for all interactive elements
- Ensure haptics don't interfere with VoiceOver
- Screen reader labels for all critical actions

## Assets Required
None specified beyond system icons. Focus on typography and glassmorphism for visual identity.