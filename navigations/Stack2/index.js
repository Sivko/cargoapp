import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Button, Text, TouchableOpacity } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";

import downloadSlotInFlights from "@/requests/communication/downloadSlotInFlights";
import uploadFlights from "@/requests/communication/uploadFlights";
import DownloadFlights from "@/screens/screen2/DownloadFlights";
// import ModalScreen from "@/screens/screen2/ModalScreen";
import ModalScreen from "@/screens/screen2/ModalScreen";
import ScannerScreen from "@/screens/screen2/ScannerScreen";
import Slot from "@/screens/screen2/Slot";
import loadingStore from "@/stores/loadingStore";
import logginStore from "@/stores/logginStore";
import pressedStore from "@/stores/pressedStore";
import scanStore from "@/stores/scanStore";

const Screens = createNativeStackNavigator();

export function Stack2({ navigation }) {
  const { idFlightsToDownloads, resetStoragescanItems, scanItems } =
    scanStore();
  const { loading, setLoading } = loadingStore();
  const { press, setPress } = pressedStore();
  const { user } = logginStore();

  return (
    <Screens.Navigator>
      <Screens.Screen
        // name={loading ? "Выполнение" : "Список рейсов"}
        name="Список рейсов"
        component={DownloadFlights}
        options={() => ({
          headerShown: true,
          headerTitleAlign: "center",
          headerLeft: () => {
            if (loading) return "";
            return press ? (
              <Button onPress={() => setPress(false)} title="Отмена" />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (loading) {
                    alert("Есть активная загрузка");
                    return;
                  }
                  navigation.navigate("Загрузка");
                }}
                style={{ marginLeft: 10 }}
              >
                <Octicons name="download" size={24} color="#2196f3" />
              </TouchableOpacity>
            );
          },
          headerRight: () => {
            if (loading) return <Text>Выполнение...</Text>;
            return press ? (
              <Button
                title="Загрузить"
                disabled={loading}
                onPress={() =>
                  downloadSlotInFlights({
                    idFlightsToDownloads,
                    resetStoragescanItems,
                    scanItems,
                    setLoading,
                    user,
                  })
                }
              />
            ) : (
              <Button
                title="Сохр. в S2"
                disabled={loading}
                onPress={() =>
                  uploadFlights({
                    resetStoragescanItems,
                    scanItems,
                    setLoading,
                    user,
                  })
                }
              />
            );
          },
        })}
      />
      <Screens.Screen
        // options={{ headerShown: false }}
        name="Сканирование"
        component={ScannerScreen}
      />
      <Screens.Screen name="Загрузка" component={ModalScreen} />
      <Screens.Screen name="Место" component={Slot} />
    </Screens.Navigator>
  );
}

export default Stack2;
