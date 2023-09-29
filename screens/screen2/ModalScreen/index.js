// import downloadFlights from "@/requests/communication/downloadFlights";
// import scanStore from "@/stores/scanStore";
import config from "@/requests/config";
import downloadFlights from "@/requests/communication/downloadFlights";
import scanStore from "@/stores/scanStore";
import axios from "axios";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import logginStore from "@/stores/logginStore";

function ModalScreen({ navigation }) {
  const { user } = logginStore();
  const { resetStoragescanItems } = scanStore();
  // const { downloadFlights } = scanStore();
  const handlerClick = () => {
    console.log("handlerClick")
    async function fetching() {
      const res = await downloadFlights(user);
      resetStoragescanItems(
        res.data.data.map((e) => ({ flight: { data: { id: e.id, type: e.type, attributes: e.attributes } } })),
      );
    }
    fetching();
    console.log("handlerClickEnd");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ textAlign: "center", marginBottom: 30 }}>
        Внимание! Все несинхронизированные данные будут потеряны, загрузить
        рейсы для сканировая?
      </Text>
      <Button onPress={() => { handlerClick(); navigation.goBack() }} title="Да, продолжить" />
    </View>
  );
}

export default ModalScreen;
