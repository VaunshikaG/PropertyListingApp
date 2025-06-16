// components/SearchBar.tsx
// A reusable search bar component.

import React from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native"; // Added Text for the clear button
// Removed 'styled' import
// import { styled } from 'nativewind';
import { FontAwesome } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { searchTermAtom } from "../stores/globalAtoms";

// No need for Styled components
// const StyledView = styled(View);
// const StyledTextInput = styled(TextInput);
// const StyledTouchableOpacity = styled(TouchableOpacity);

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search properties...",
}) => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    // Directly use View, TextInput, TouchableOpacity with className
    <View className="flex-row items-center bg-gray-100 rounded-lg py-3 px-4 mx-4 my-4 shadow-sm border border-gray-200">
      <FontAwesome name="search" size={20} color="#6b7280" className="mr-3" />
      <TextInput
        className="flex-1 text-base text-gray-800 font-inter-regular"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={searchTerm}
        onChangeText={setSearchTerm}
        clearButtonMode="while-editing" // iOS specific clear button
        accessibilityLabel="Search properties"
      />
      {searchTerm.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="ml-3 p-1 rounded-full bg-gray-200"
        >
          <FontAwesome name="times-circle" size={18} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
