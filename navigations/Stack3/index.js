import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import Options from "@/screens/screen3/Options";
const Screens = createNativeStackNavigator();

export function Stack3() {
  return (
    <Screens.Navigator>
      <Screens.Screen
        options={{ headerShown: false }}
        name="Options"
        component={Options}
      />
    </Screens.Navigator>
  );
}

export default Stack3;
