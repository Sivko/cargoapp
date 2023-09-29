import AntDesign from 'react-native-vector-icons/AntDesign';

import moment from "moment";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import SlotList from "@/components/slot/SlotList";
import defaultInvoice from "@/requests/local/defaultInvoce";
import defaultSlot from "@/requests/local/defaultSlot";
import invocesToUploadStore from "@/stores/invocesToUploadStore";

function CreateScreen({ route, navigation }) {
  const { clientCode, countBox, numberTTN } = route.params;
  const { setStorageInvocesToUpload } = invocesToUploadStore();
  // const { setStorage, invocesToUpload } = invocesToUploadStore();
  const [name, setName] = useState(
    `КВ от ${moment().format(
      "DD.MM.YYYY hh:mm",
    )}, ${clientCode}, ${countBox} кор.`,
  );
  // const [invoice, setInvoice] = useState({});
  const [slots, setSlots] = useState([defaultSlot({ clientCode, numberTTN })]);
  // function hendlerSave() {
  //   invoice.data.attributes.name = name;
  //   invoice.data.attributes.customs[fields['clientCode']] = info.clientCode;
  //   setInvocesData(invoice);
  //   slots.map(e => {
  //     let tmpSlot = e
  //     tmpSlot.data.attributes.customs[fields['clientCode']] = info.clientCode;
  //     return tmpSlot
  //   })
  //   setInvocesToUploadData({ invoice, slots });
  // }

  function save() {
    setStorageInvocesToUpload({
      invoice: defaultInvoice({ name, clientCode, numberTTN }),
      slots,
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={{ fontSize: 10, opacity: 0.2 }}>Название:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(e) => setName(e)}
          value={name}
        />
      </View>
      <SlotList data={slots} setData={setSlots} navigation={navigation} />

      <View style={{ flexDirection: "row", flexBasis: 50, gap: 50 }}>
        <TouchableOpacity style={styles.save} onPress={save}>
          <Text style={{ color: "#fff" }}>Сохранить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.add}
          onPress={() => {
            setSlots((prev) => {
              navigation.push("Место", {
                data: [...prev, defaultSlot({ clientCode, numberTTN })],
                setData: setSlots,
                index: prev.length + 1,
                navigation,
              });
              return [...prev, defaultSlot({ clientCode, numberTTN })];
            });
          }}
        >
          {/* <Text>Добавить место (добавлено:)</Text> */}
          <AntDesign name="pluscircleo" size={50} color="#207aff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // height: '100%'
  },
  save: {
    flex: 1,
    backgroundColor: "#207aff",
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    justifyContent: "center",
    position: "absolute",
    top: -60,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 10,
    backgroundColor: "#f3f3f3",
  },
  input: {},
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DDDDDD",
  },
  errors: {
    color: "#fc2847",
  },
});

export default CreateScreen;
