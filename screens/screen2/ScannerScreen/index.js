import Entypo from 'react-native-vector-icons/Entypo';

import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Button, TextInput, Text, TouchableOpacity } from "react-native";

import SlotList from "@/components/slot/SlotList";
import { fields } from "@/requests/config";
import defaultSlot from "@/requests/local/defaultSlot";
import scanStore from "@/stores/scanStore";
export function ScannerScreen({ navigation, route }) {
  const { scanItems, resetStoragescanItems } = scanStore();
  const [index, setIndex] = useState(route.params?.index || null);
  const [slot, setSlot] = useState([scanItems[route.params.index]][0].slots);
  // console.log([scanItems[route?.params?.index]][0].slots, "123123");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [boolShowSoftInputOnFocus, setBoolShowSoftInputOnFocus] = useState(false);
  // console.log(navigation,"navigation")
  const inputToFocus = useRef(null);
  useEffect(() => {
    setInterval(() => {
      if (inputToFocus?.current) {
        inputToFocus.current.focus();
      }
    }, 1000)
  }, []);

  useEffect(() => {
    if (index !== null) {
      const tmp = JSON.parse(JSON.stringify(scanItems));
      // debugger
      tmp[Number(index)].slots = JSON.parse(JSON.stringify(slot));
      resetStoragescanItems(tmp);
      // debugger
      // console.log(tmp, "TTTMP", index);
    }
  }, [slot, route]);

  function searchSlot(input) {
    setBarcodeInput(input.trim());
    const find = slot.filter(
      (item) => item.data.attributes.customs[fields["barcode"]] == input.trim(),
    );
    if (find.length === 1) {
      const elem = find[0];
      if (elem.data?.id) {
        elem.data.attributes.customs[fields["scanTSD"]] = "Найдено";
        setSlot([elem, ...slot.filter((e) => e.data.id !== find[0].data.id)]);
        setBarcodeInput("");
        // resetStorageInvocesToUpload([elem, ...slot.filter((e) => e.data.id !== find[0].data.id)]);
      }
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapperInput}>
          <TextInput
            style={{
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
              flex: 1,
              paddingVertical: 10,
            }}
            ref={inputToFocus}
            keyboardType="numeric"
            value={barcodeInput}
            autoFocus={true}
            autoCorrect={false}
            showSoftInputOnFocus={boolShowSoftInputOnFocus}
            onChangeText={searchSlot}
            placeholder="Штрих-код"
          />
          <TouchableOpacity onPress={() => setBoolShowSoftInputOnFocus(prev => !prev)}>
            <Entypo name="keyboard" size={30} color={boolShowSoftInputOnFocus ? "#2196f3" : "#d3d3d3"} />
          </TouchableOpacity>
          <Button
            style={{ flex: 1 }}
            title="Добавить"
            onPress={() => {
              const tmp = defaultSlot({ clientCode: "", numberTTN: "" });
              tmp.data.attributes.customs[fields["scanTSD"]] = "Ошибка";
              tmp.data.attributes.customs[fields["barcode"]] = barcodeInput;
              tmp.invoices = slot[0]?.invoices || [];
              tmp.invoiceId = slot[0]?.invoiceId || "";
              setSlot((prev) => [tmp, ...prev]);
              setBarcodeInput("");
            }}
          />
        </View>
        <View style={{ width: "100%", display: "flex", flexDirection: 'column', flexGrow: 1, flexShrink: 1, flexBasis: '0%' }}>
          <SlotList
            data={slot.filter((e) => {
              if (barcodeInput) {
                if (e.data.attributes?.customs[fields["barcode"]])
                  return e.data.attributes?.customs[fields["barcode"]].includes(barcodeInput);
              } else {
                return true;
              }
            })}
            setData={setSlot}
            navigation={navigation}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  wrapperInput: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  containerSafe: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
});

export default ScannerScreen;
