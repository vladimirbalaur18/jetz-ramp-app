import React, { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";

const AutocompleteDropdown = ({ options, onSelect }) => {
  const [searchText, setSearchText] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search..."
      />
      <FlatList
        data={filteredOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text onPress={() => onSelect(item)}>{item.label}</Text>
        )}
      />
    </View>
  );
};

export default AutocompleteDropdown;
