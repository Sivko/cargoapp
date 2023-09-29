import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import Stack1 from "@/navigations/Stack1";
import Stack2 from "@/navigations/Stack2";
import Stack3 from "@/navigations/Stack3";
import Stack4 from "@/navigations/Stack4";
import { View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "Принять места":
              return <FontAwesome name="dropbox" size={size} color={color} />;
            case "Сканировать рейсы":
              return <FontAwesome name="barcode" size={size} color={color} />;
            case "Настройки":
              return <Ionicons name="options" size={size} color={color} />;
          }
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "#207aff",
      })}
    >
      <Tab.Screen name="Принять места" component={Stack1} />
      <Tab.Screen name="Сканировать рейсы" component={Stack2} />
      <Tab.Screen name="Настройки" component={Stack3} />
      <Tab.Screen name="Настройки2" component={Stack4} />
    </Tab.Navigator>
  );
}
