# UnsubX - Project Documentation

## Project Overview
UnsubX is an iOS subscription management app that helps users identify, track, and cancel unused subscriptions to save money.

## Key Features
1. **Onboarding** - Quick subscription count estimation
2. **Scanning** - Animated subscription discovery interface
3. **Results** - Detailed view of detected subscriptions with estimated waste
4. **Paywall** - Subscription tier selection (Monthly/Annual)
5. **Savings** - Track cancellations and monitor savings over time

## Design System
- **Theme**: Dark mode (iOS 26 liquid glass UI)
- **Background**: #08090C
- **Glass Cards**: rgba(255,255,255,0.18)
- **Accent Colors**: 
  - Waste/Negative: #FF4D4D
  - Savings/Positive: #32D583
- **Typography**: Large currency displays (72px)
- **Interactions**: Full haptic feedback system

## Architecture
- **Frontend**: Expo + React Native (TypeScript)
- **Backend**: Express.js (TypeScript)
- **Database**: PostgreSQL (via Neon)
- **State Management**: React Query + In-memory
- **Navigation**: React Navigation 7

## Key Files
- `client/screens/` - All 5 main screens
- `client/constants/theme.ts` - Color and spacing constants
- `client/navigation/RootStackNavigator.tsx` - Navigation structure
- `app.json` - App configuration (name, icons, bundle ID)
- `server/` - Express backend

## Recent Changes
- Added Privacy Policy and Terms of Service links to PaywallScreen
- Changed app name from SubKillX to UnsubX
- Updated bundle identifiers and slug in app.json

## User Preferences
- iOS-first experience
- Dark mode only
- No mock data (use real device capabilities)
- Minimalist design with liquid glass effects
