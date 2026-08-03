// setup.js
const fs = require('fs');
const path = require('path');

// Saari files aur unke folders ki list
const filesToCreate = [
  // Core Configuration & Style Guides
  'src/constants/theme.js',              // Primary Green palette, typography, layout spacings
  'src/constants/strings.js',            // Localization or app-wide static text
  'src/navigation/AppNavigator.js',      // Main Navigation container combining Auth and Main stack
  'src/navigation/routes.js',            // Typed route name constants

  // Global Components (Shared across multiple features)
  'src/components/common/Button.js',     // Your primary rounded action buttons
  'src/components/common/Input.js',      // Auth input fields with validation states
  'src/components/common/Header.js',     // Custom navigation header with profile action items
  'src/components/common/Loader.js',     // Global overlay spinner for loading states
  'src/components/common/Modal.js',      // Base reusable confirmation/bottom-sheet modal

  // Auth & Onboarding Flow Modules
  'src/screens/auth/SplashScreen.js',        // <-- NEW: Handles initial asset/token loading checks
  'src/screens/auth/OnboardingScreen.js',    // <-- NEW: The swipeable introduction carousel
  'src/components/auth/OnboardingSlide.js',  // <-- NEW: Render item layout for onboarding slides
  'src/screens/auth/LoginScreen.js',
  'src/screens/auth/SignupScreen.js',
  'src/screens/auth/VerifyEmailScreen.js',
  'src/screens/auth/CompleteProfileScreen.js', // Step-by-step onboarding wizard
  'src/components/auth/OtpInputField.js',

  // Discovery & Matching Modules
  'src/screens/main/DiscoverScreen.js',  // The core profile swiping/matching engine
  'src/screens/main/MatchesScreen.js',   // Grid layout displaying mutual likes
  'src/components/discover/ProfileCard.js', // The swipeable deck asset layout
  'src/components/discover/ActionButtons.js', // Pass, Like, Superlike buttons

  // Messaging & Real-Time Communication Modules
  'src/screens/main/ChatListScreen.js',  // Active message logs list view
  'src/screens/main/ChatRoomScreen.js',  // Individual user chat window
  'src/screens/main/VideoCallScreen.js', // Agora Video Chat integration layout
  'src/components/chat/MessageBubble.js',
  'src/components/chat/CallOverlay.js',  // Incoming/Outgoing call setup hud

  // User Profile & Settings Modules
  'src/screens/main/ProfileScreen.js',   // Detailed self view
  'src/screens/main/SettingsScreen.js',  // Toggles, Account configs, Log Out
  'src/components/profile/PhotoGrid.js',

  // Subscription & Payment Wall Modules
  'src/screens/premium/SubscriptionScreen.js', // Package pricing grid
  'src/screens/premium/PaymentScreen.js',      // Secure transaction screen
  'src/components/premium/PlanCard.js',

  // Redux Toolkit Architecture Setup
  'src/redux/store.js',
  'src/redux/hooks.js',                  // Custom typed hooks: useAppDispatch & useAppSelector
  'src/redux/slices/authSlice.js',       // Handles tokens, active user profiles
  'src/redux/slices/matchSlice.js',      // Handles potential card arrays, swipe logs
  'src/redux/slices/chatSlice.js',       // Stores background channel messages
  'src/redux/slices/callSlice.js',       // Manages Agora session states, call states

  // Infrastructure & Utility Operations
  'src/services/agoraService.js',        // Native wrapper class handling RTC engine operations
  'src/services/storageService.js',      // Encrypted tokens via Expo SecureStore or MMKV
  'src/services/apiService.js',          // Global Axios config/interceptors instance
  'src/utils/validation.js',             // RegEx definitions for phone numbers and email formats
  'src/utils/helpers.js'                 // Timestamp parsing or text format utilities
];

console.log('🏗️ Creating your structure...');

filesToCreate.forEach(filePath => {
  const absolutePath = path.join(process.cwd(), filePath);
  const dirPath = path.dirname(absolutePath);

  // Agar folder nahi bana hai, toh pehle folder create karo
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Agar file pehle se nahi bani hai, toh empty file banao
  if (!fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, '', 'utf8');
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️ Already exists: ${filePath}`);
  }
});

console.log('🚀 Poora folder structure ready hai!');