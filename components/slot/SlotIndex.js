/* eslint-disable prettier/prettier */
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';

// import ImagePickerPreview from '../imagePicker/ImagePickerPreview';
import { fields } from "@/requests/config";

function SlotIndex({ route, navigation }) {
  const [data, setData] = useState(route.params.data);
  const [length, setLength] = useState(route.params.data[route.params.index - 1].data?.attributes?.customs[fields["length"]] || "");
  const [width, setWidth] = useState(route.params.data[route.params.index - 1].data?.attributes?.customs[fields["width"]] || "");
  const [height, setHeight] = useState(route.params.data[route.params.index - 1].data?.attributes?.customs[fields["height"]] || "");
  const [weight, setWeight] = useState(route.params.data[route.params.index - 1].data?.attributes?.customs[fields["weight"]] || "");
  const [barcode, setBarcode] = useState(route.params.data[route.params.index - 1].data?.attributes?.customs[fields["barcode"]] || "");
  const [description, setDescription] = useState(route.params.data[route.params.index - 1].data?.attributes?.description);
  const [transport, setTransport] = useState(route.params.data[route.params.index - 1].data?.attributes?.customs[fields["transport"]][0] || "");
  const [invoiceId, setInvoiceId] = useState(route.params.data[route.params.index - 1].invoiceId || "");
  const [invoces, setInvoices] = useState(route.params.data[route.params.index - 1].invoices || []);
  const [uploadStatus, setUploadSatus] = useState(route.params.data[route.params.index - 1].uploadStatus || false);
  const [photos, setPhotos] = useState(route.params.data[route.params.index - 1].photos || []);

  useEffect(() => {
    setData((prev) => {
      const slots = JSON.parse(JSON.stringify(prev));
      slots[route.params.index - 1].data.attributes.description = description;
      slots[route.params.index - 1].data.attributes.customs[fields["length"]] = length;
      slots[route.params.index - 1].data.attributes.customs[fields["width"]] = width;
      slots[route.params.index - 1].data.attributes.customs[fields["height"]] = height;
      slots[route.params.index - 1].data.attributes.customs[fields["weight"]] = weight;
      slots[route.params.index - 1].data.attributes.customs[fields["barcode"]] = barcode;
      slots[route.params.index - 1].data.attributes.customs[fields["transport"]] = transport;
      slots[route.params.index - 1].invoiceId = invoiceId;
      slots[route.params.index - 1].uploadStatus = false;
      slots[route.params.index - 1].photos = photos;
      return slots;
    });
  }, [length, width, height, transport, weight, description, barcode, uploadStatus, invoiceId, photos]);

  function focus(setValue) {
    return function (e) {
      if (Number(e.target.value) === 0) {
        setValue('')
      }
    }
  }

  const handleError = () => {
    if (isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

  useEffect(() => { console.log(photos) }, [photos])

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          {/* <Text>{JSON.stringify(route.params.data[route.params.index - 1].attributes?.customs['custom_114632'])}</Text> */}
          {/* <ImagePickerPreview> */}
          <ScrollView horizontal={true} style={{ marginBottom: 10, flex: 1 }}>
            <View style={{ marginRight: 20 }}>
              <TouchableOpacity onPress={() => {
                navigation.push("Камера", {
                  setPhotos: (e) => setPhotos(e),
                  route,
                  navigation: navigation
                });
              }}>
                <AntDesign name="camera" size={60} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                DocumentPicker.pick({ allowMultiSelection: true, type: types.images, copyTo: 'documentDirectory' }).then((e) => { setPhotos(prev => [...e, ...prev]) }).catch(handleError)
              }}>
                <AntDesign name="picture" size={60} color="black" />
              </TouchableOpacity>
            </View>
            {photos[0] && photos.map((e, index) => (<View style={styles.docItem}>
              <Image style={styles.preview} source={{ uri: e.fileCopyUri }} />
              <TouchableOpacity
                style={styles.delete}
                onPress={() => setPhotos(prev => prev.filter((e, i) => index !== i))}
              >
                <AntDesign name="close" size={12} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={photos[index].name.includes('brak_') ? { ...styles.status, backgroundColor: '#fc0', opacity: 1 } : styles.status}
                onPress={() => { setPhotos(prev => { prev[index].name?.includes('brak_') ? prev[index].name = prev[index].name.replace('brak_', '') : prev[index].name = "brak_" + prev[index].name; return JSON.parse(JSON.stringify(prev)) }) }}
              >
                <Text>Брак</Text>
              </TouchableOpacity>
            </View>
            )) || (<Text style={{marginTop: 50}}>Не указаны фото с данного ТСД</Text>)} 
          </ScrollView>
          <View style={styles.dimensions}>
            <View style={styles.wrapper}>
              <View style={styles.fieldSet}>
                <Text style={styles.legend}>Длина</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.legendInput}
                  onChangeText={(e) => setLength(e)}
                  value={String(length)}
                  onFocus={focus(setLength)}
                />
              </View>
            </View>
            <View style={styles.wrapper}>
              <View style={styles.fieldSet}>
                <Text style={styles.legend}>Ширина</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.legendInput}
                  onChangeText={(e) => setWidth(e)}
                  value={String(width)}
                  onFocus={focus(setWidth)}
                />
              </View>
            </View>
            <View style={styles.wrapper}>
              <View style={styles.fieldSet}>
                <Text style={styles.legend}>Высота</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.legendInput}
                  onChangeText={(e) => setHeight(e)}
                  value={String(height)}
                  onFocus={focus(setHeight)}
                />
              </View>
            </View>
            <View style={styles.wrapper}>
              <View style={styles.fieldSet}>
                <Text style={styles.legend}>Вес</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.legendInput}
                  onChangeText={(e) => setWeight(e)}
                  value={String(weight)}
                  onFocus={focus(setWeight)}
                />
              </View>
            </View>
            {/* </View>
          <View style={{ flex: 1, flexDirection: "row" }}> */}
            {/* <View style={{ ...styles.wrapper, width: "100%" }}>
              <View style={styles.fieldSet}>
                <Text style={styles.legend}>Штрих-код</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.legendInput}
                  onChangeText={(e) => setBarcode(e)}
                  value={String(barcode ?? "")}
                  onFocus={focus(setBarcode)}
                />
              </View>
            </View> */}
          </View>
          <View style={{ ...styles.wrapper, width: "100%" }}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Вид транспорта:</Text>
              <View style={styles.pickerWrapper}>
                {["AIRLINE", "TRUK", "TRAIN", "SEA"].map((e, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      ...styles.picker,
                      backgroundColor: transport === e ? "#207aff" : "#ddd",
                    }}
                    onPress={() => setTransport(e)}
                  >
                    <Text style={{ color: transport === e ? "#fff" : "#000" }}>
                      {e}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={{ ...styles.wrapper, width: "100%" }}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Квитанция:</Text>
              <View style={styles.pickerWrapper}>
                {invoces.map((e, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      ...styles.picker,
                      backgroundColor: e.id === invoiceId ? "#207aff" : "#ddd",
                    }}
                    onPress={() => setInvoiceId(e.id)}
                  >
                    <Text style={{ color: e.id === invoiceId ? "#fff" : "#000" }}>
                      {e.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={{ ...styles.wrapper, width: "100%" }}>
            <View style={{ ...styles.fieldSet, minWidth: "100%" }}>
              <Text style={styles.legend}>Примечание</Text>
              <TextInput
                style={{ ...styles.legendInput, flex: 1, width: "100%" }}
                editable
                multiline
                numberOfLines={4}
                // maxLength={20}
                onChangeText={(e) => setDescription(e)}
                // value={description}
                value={description ?? ""}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#207aff",
                alignItems: "center",
                width: "100%",
              }}
              onPress={() => {
                route.params.setData(data);
                route.params.navigation.goBack();
              }}
            >
              <Text style={{ padding: 20, color: "#fff" }}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  card: {
    flex: 1,
    gap: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
  },
  dimensions: {
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    alignItems: "flex-start",
    // padding: 10
  },
  wrapper: {
    width: "50%",
    padding: 5,
  },
  fieldSet: {
    paddingBottom: 0,
    borderRadius: 5,
    borderWidth: 1,

    alignItems: "center",
    borderColor: "#d3d3d3",
  },
  legend: {
    position: "absolute",
    top: -10,
    left: 10,
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
  },
  legendInput: {
    padding: 10,
    width: "100%",
  },
  pickerWrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingVertical: 20,
    flexWrap: "wrap",
    minWidth: "100%",
  },
  picker: {
    margin: 5,
    padding: 10,
  },
  delete: {
    backgroundColor: '#f66',
    borderRadius: 100,
    padding: 6,
    position: 'absolute',
    end: -6,
    top: 10,
  },
  status: {
    backgroundColor: '#d3d3d3',
    padding: 6,
    position: 'absolute',
    left: 0,
    opacity: 0.7,
    bottom: 12,
  },
  preview: {
    width: 100,
    height: 100,
    // borderRadius: 100,
  },
  docItem: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 12,
  },
});

export default SlotIndex;
