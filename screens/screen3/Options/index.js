import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";

// import { removeFlightDeals } from "@/requests/local/getSetFlights";
import { getLogsData, removeLogsData } from "@/requests/local/getSetLogs";
import loadingStore from "@/stores/loadingStore";
import logginStore from "@/stores/logginStore";
import scanStore from "@/stores/scanStore";
export function Option() {
  const { setLoading } = loadingStore();
  const { removeStoragescanItems } = scanStore();
  const { unloggin, user } = logginStore();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetching() {
      const res = await getLogsData();
      setLogs(res);
    }
    fetching();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
          {/* <Button
            title="Очистить Рейсы"
            onPress={() => {
              removeFlightDeals();
            }}
          /> */}
          <Text style={{marginBottom: 10}}>{user.firstName} {user.lastName}</Text>
          <Text style={{marginBottom: 10}}>{user.email} ({user.id})</Text>
          <Text style={{marginBottom: 40}}>ID рук-ля: {user?.directorId || "-"}</Text>
          {/* <View style={styles.btn}>
            <Button
              title="Очистить Логи"
              onPress={() => {
                removeLogsData([]);
                setLogs([]);
              }}
            />
          </View> */}
          <View style={styles.btn}>
            <Button
              title="Изменить флаг загрузки"
              onPress={() => {
                setLoading(false);
                alert("Все состояния сброшены");
              }}
            />
          </View>
          <View style={styles.btn}>
            <Button title="Удалить загр. рейсы" onPress={removeStoragescanItems} />
          </View>
          <View style={styles.btn}>
          <Button title="Выйти" onPress={unloggin} />
          </View>
          {/* <Text>Логи:</Text>
          <Text>{JSON.stringify(logs)}</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  btn: {
    marginBottom: 10
  }
});

export default Option;
