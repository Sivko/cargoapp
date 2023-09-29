import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function FlightCard({ name, active, setActive }) {
  return (
    <TouchableOpacity style={styles.section} onPress={setActive}>
      <Text style={styles.paragraph}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 55,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
