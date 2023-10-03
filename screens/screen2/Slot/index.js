import { StyleSheet } from "react-native";

import SlotIndex from "@/components/slot/SlotIndex";

function Slot({ route, navigation }) {
  return <SlotIndex route={route} navigation={navigation} />;
}

// const styles = StyleSheet.create({});

export default Slot;
