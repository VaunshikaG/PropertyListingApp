# property-listing-app

This is a React Native property listing app built using Expo SDK 50 and TypeScript. The app displays a list of properties, and allows users to view details with image sliders, location info, and other property attributes.

## How to Run the App on Android Emulator

1. Install dependencies

   Make sure you're using:

   - Node.js `v22.16.0`
   - npm `v10.8.2`
   - npm install
   - npm install @react-native-async-storage/async-storage @tanstack/react-query expo-blur expo-haptics expo-image expo-image-picker expo-linear-gradient expo-location lucide-react-native zustand react-native-community/datetimepicker --force or --legacy-peer-deps
     (for --force or --legacy-peer-deps are flags used with npm install to handle dependency conflicts)
   - npm install @react-native-community/datetimepicker

2. Install server and run it

   - npm install -g json-server
   - json-server --watch mocks/db.json --port 5000

3. Start Your Android Emulator:

   - Open Android Studio, go to the AVD Manager, and start one of your configured Android emulators. Make sure it's fully booted up before proceeding.

4. Run the App:

   - npm start

   If you run into issues, try clearing the Metro bundler cache:

   - npm start -- --reset-cache

---

## 📝 Assumptions

1. The reviewer has a working installation of Node.js, npm/yarn, and Android Studio with an emulator configured.

2. The codebase uses Expo for development and bundling.

3. The app expects property images as an array under the images key in the property object (e.g., property.images), not property.image.

4. All required environment variables (if any) are set in a .env file or are not needed for local development.

---

## ℹ️ Reviewer Instructions

1. If you encounter a Babel error like .plugins is not a valid Plugin property, double-check the babel.config.js file. It should use only compatible plugins and presets.

2. For image rendering, the app displays all property images using a .map() over the images array. If the array is empty, a fallback image is shown.

3. If you run into dependency conflicts (e.g., React or React Native version mismatches), check the package.json for required versions and align as per Expo SDK compatibility.

4. To test on a real device, scan the QR code from the Expo CLI output using the Expo Go app on your phone.
