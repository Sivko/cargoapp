import { useState, useEffect } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";

// import { removeFlightDeals } from "@/requests/local/getSetFlights";
import { getLogsData, removeLogsData } from "@/requests/local/getSetLogs";
import loadingStore from "@/stores/loadingStore";
import logginStore from "@/stores/logginStore";
import scanStore from "@/stores/scanStore";
import { version, constantLinkToApp, config } from "@/requests/config";
import axios from "axios";
export function Option() {
  const { setLoading } = loadingStore();
  const { removeStoragescanItems } = scanStore();
  const { unloggin, user } = logginStore();
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [linkToUpdate, setLinkToUpdate] = useState("")


  async function getActualVersionApp() {
    setMessage("Загрузка ...")
    try {
      const data = await axios.get(`https://app.salesap.ru/api/v1/constants/${constantLinkToApp}`, config());
      const res = data.data.data.attributes.value.split("||")
      const [_version, link] = res;
      if (_version == version) {setMessage("У вас актуальная версия :)");setLinkToUpdate("")}
      else { setMessage(`Есть обновление до ${_version}`); setLinkToUpdate(link) }
    } catch (err) {
      setMessage("Что-то пошло не так " + err.message)
    }
  }

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
          <Text style={{ marginBottom: 10 }}>{user.firstName} {user.lastName}</Text>
          <Text style={{ marginBottom: 10 }}>{user.email} ({user.id})</Text>
          <Text style={{ marginBottom: 40 }}>ID рук-ля: {user?.directorId || "-"}</Text>
          <Text style={{ marginBottom: 40 }}>{message}</Text>

          {linkToUpdate && (<View style={styles.btn}>
            <TouchableOpacity style={styles.btnLink} onPress={()=>Linking.openURL(linkToUpdate)} >
              <Text style={styles.btnText}>Перейти</Text>
            </TouchableOpacity>
          </View>)}

          <View style={styles.btn}>
            <Button title={`Проверить обновления (сейчас ${version})`} onPress={getActualVersionApp} />
          </View>
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
  },
  btnLink: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#1E6738',
    // borderRadius: 10,
    // borderWidth: 1,
    borderColor: '#fff'
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  }
});

export default Option;
