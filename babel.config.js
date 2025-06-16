module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin", // Required for reanimated
      require.resolve("expo-router/babel"), // Required for expo-router
    ],
  };
};
