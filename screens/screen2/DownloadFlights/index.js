import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import pressedStore from "@/stores/pressedStore";
import scanStore from '@/stores/scanStore';
import { fields } from '@/requests/config';

export default function DownloadFlights({ navigation }) {
  const { scanItems, getStoragescanItems, setIdFlightsToDownloads } = scanStore();
  const { press, setPress } = pressedStore();
  const [checkedElements, setCheckedElements] = useState([]);
  // const [items, setItems] = useState(scanItems);

  useEffect(() => {
    getStoragescanItems();
    setCheckedElements([]);
  }, [press]);

  useEffect(() => {
    setIdFlightsToDownloads(checkedElements);
  }, [checkedElements]);

  function hendlerCard(index) {
    setPress(true);
    // setCheckedElements(prev => [!prev[0]]);
  }
  function hendlerClickCard(index, scanItems) {
    if (!press) {
      if (scanItems[index]?.slots?.length) {
        navigation.push("Сканирование", { index: String(index) });
        return;
      } else {
        alert("Нет загруженных мест");
      }
    }
    // alert("!press Click")
    if (press) {
      if (scanItems[index]?.slots?.length) {
        return;
      }
      if (checkedElements.includes(scanItems[index].flight.data.id)) {
        setCheckedElements(prev => prev.filter(e => e !== scanItems[index].flight.data.id))
      } else {
        setCheckedElements(prev => [...prev, scanItems[index].flight.data.id])
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {scanItems?.map((e, index) => (
          <View key={Math.random()}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => hendlerClickCard(index, scanItems)}
              onLongPress={() => hendlerCard(index, scanItems)}
              delayLongPress={500}
            >
              <Text style={{width: '20px'}}>{index + 1}</Text>
              <View style={{width: '200px'}}> 
                <Text>ID: {e.flight.data?.id}</Text>
                <Text>{e.flight.data.attributes.name}</Text>
                {/* <Text>Код. кл: {e.flight.data?.attributes?.customs[fields["clientCode"]]}</Text> */}
                <Text>Транспорт: {e.flight.data?.attributes?.customs[fields["transport"]]}</Text>
              </View>
              <View>
                <Text>Кол-во мест: {e?.slots?.length}</Text>
                <Text>Ошибок: {e?.slots?.filter((el) => el.data?.attributes?.customs[fields["scanTSD"]] == "Ошибка")?.length}</Text>
                <Text>Статус: {e?.flight.data?.attributes?.customs[fields["scanTSD"]]}</Text>
              </View>
              <View style={{ gap: 10 }}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  {/* {e?.slots?.filter((e) => e.data.id)?.length == e?.slots?.filter((e) => e.data.id).length && <Feather name="upload-cloud" size={24} color="#2196f3" />}
                  {e?.slots?.filter((e) => e.data.id)?.length && e?.slots?.filter((e) => e.data.id).length && <Feather name="upload-cloud" size={24} color="#deb617" />}
                  {!e?.slots?.filter((e) => e.data.id)?.length && !e?.slots?.filter((e) => e.data.id).length && <Feather name="upload-cloud" size={24} color="#ddd" />} */}

                  <Text style={{ fontSize: 10 }}>
                    Отпр: {e?.slots?.filter(e => e?.uploadStatus === true).length || 0}
                  </Text>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  {e?.slots?.filter((e) => e.data.id)?.length && <Feather name="download-cloud" size={24} color="#2196f3" />}
                  {!e?.slots?.filter((e) => e.data.id)?.length && <Feather name="download-cloud" size={24} color="#ddd" />}
                  <Text style={{ fontSize: 10 }}>
                    Загр: {e?.slots?.filter(e => e?.data?.id)?.length || "0"}
                  </Text>
                </View>
              </View>
              {/* {press && !e?.slots?.filter((e) => e.data.id)?.length && ( */}
              {press && (
                <View style={{ flexBasis: 25 }}>
                  {checkedElements.includes(e.flight.data.id) && (
                    <FontAwesome name="check-circle" size={24} color="#2196f3" />
                  )}
                  {!checkedElements.includes(e.flight.data.id) && (
                    <FontAwesome name="circle-o" size={24} color="#ddd" />
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#ddd",
  },
  card: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
});
