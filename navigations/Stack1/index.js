import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Button } from "react-native";

import SlotIndex from "@/components/slot/SlotIndex";
import uploadInvocesSlots from "@/requests/communication/uploadInvocesSlots";
// import AddInvoice from "../screens/AddInvoice";
// import AddInvoices from "../screens/AddInvoices";
// import Invoces from "../screens/Invoces";
// import Slot from "../screens/Slot";
// uploadInvocesSlots
import CreateScreen from "@/screens/screen1/CreateScreen";
import FirstScreen from "@/screens/screen1/FirstScreen";
import Invoices from "@/screens/screen1/Invoices";
import invocesToUploadStore from "@/stores/invocesToUploadStore";
import loadingStore from "@/stores/loadingStore";
import loggerStore from "@/stores/loggerStore";
// import val from "@/requests/upload/uploadInvocesSlots";
const SettingsStack = createNativeStackNavigator();

export function Stack1() {
  const { invocesToUpload, resetStorageInvocesToUpload } =
    invocesToUploadStore();
  const { loading, setLoading } = loadingStore();
  const { setLoggerStore } = loggerStore();

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        options={{ headerShown: false }}
        name="AddInvoices"
        component={FirstScreen}
      />
      <SettingsStack.Screen name={"Оформить"} component={CreateScreen} />
      <SettingsStack.Screen name={"Место"} component={SlotIndex} />
      <SettingsStack.Screen
        name={"Квитанции"}
        component={Invoices}
        options={() => ({
          headerRight: () => (
            <Button
              title={loading ? "Отправка" : "Отправить"}
              disabled={!!loading}
              onPress={() => {
                uploadInvocesSlots({
                  invocesToUpload,
                  setLoggerStore,
                  resetStorageInvocesToUpload,
                  setLoading,
                });
              }}
            />
          ),
        })}
      />
    </SettingsStack.Navigator>
  );
}

export default Stack1;
