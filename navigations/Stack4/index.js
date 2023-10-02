import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from "react";
// import * as React from "react";
import { Button, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import { RNCamera } from 'react-native-camera';
import axios from "axios";
import config from "@/requests/config";
import logginStore from "@/stores/logginStore";

const Screens = createNativeStackNavigator();


function Options() {
  const { user, loggin } = logginStore();
  const [photos, setPhotos] = useState([]);
  const [result, setResult] = useState(null);

  // const getBase64 = async (imageUri) => {
  //   const filepath = imageUri.split('//')[1];
  //   const imageUriBase64 = await RNFS.readFile(filepath, 'base64');
  //   return `data:image/jpeg;base64,${imageUriBase64}`;
  // }

  const uploadFiles = async () => {
    const data = await axios.post('https://upload.app.salesap.ru/api/v1/files', {
      // const data = await axios.post('https://webhook.site/893b1b20-d021-47ba-b7d1-a4264ef51f86', {
      "type": "files",
      "data": {
        "filename": photos[0].name,
        "resource-type": "deals",
        "resource-id": 7637861
      }
    }, config(user?.token)).catch(e => console.log(e.response.data));
    try {
      const fields = data.data.data["form-fields"];
      let formData = new FormData();
      for (let key in fields) {
        if (fields.hasOwnProperty(key)) {
          formData.append(key, fields[key])
        }
      }
      formData.append("file", photos[0]);
      const uploadData = await axios.post('https://storage.yandexcloud.net/salesapiens', formData);
      // const uploadData = await axios.post('https://webhook.site/893b1b20-d021-47ba-b7d1-a4264ef51f86', formData);
      console.log(uploadData, "uploadData");
    } catch (err) { console.log("Не удалось загрузить") }
  }

  useEffect(() => {
    console.log(photos, "photos");
    // if (result)
    //   console.log(result.base64, "result");
    // // result.map(e => e.uri);
  }, [photos, result])


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


  takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setResult(data.uri)
      console.log(data.uri);
    }
  };

  return (
    <View style={styles.container}>
      {photos.map(e => (<View style={{ flex: 1 }} >
        <View style={{ height: 200, flexDirection: 'column', flexWrap: 'nowrap' }}>
          <ScrollView horizontal={true} style={{flex: 1}}>
            <Image style={{ height: 'auto', flexBasis: '10%', width: '10%', flex: 1 }} source={{ uri: e.uri }} />
          </ScrollView>
        </View>
      </View>))}
      {result && (<View style={{ flex: 1, width: '100%', height: 100 }}>
        <Text>Photo:</Text>
        <Image style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: result }} />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => { }} style={{ borderRadius: 100, backgroundColor: "#303030", padding: 20 }}>
            <AntDesign name="check" size={30} color="#d3d3d3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setResult(null)} style={{ borderRadius: 100, backgroundColor: "#303030", padding: 20 }}>
            <AntDesign name="close" size={30} color="#d3d3d3" />
          </TouchableOpacity>
        </View>
      </View>)}
      {/* {!result && (<View style={{ flex: 1, width: '100%', height: 100 }}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => takePicture()} style={{ borderRadius: 100, backgroundColor: "#303030", padding: 20 }}>
            <AntDesign name="camerao" size={30} color="#d3d3d3" />
          </TouchableOpacity>
        </View>
      </View>)} */}
      <Button
        title="open picker for multi file selection"
        onPress={() => {
          DocumentPicker.pick({ allowMultiSelection: true, type: types.images }).then(setPhotos).catch(handleError)
        }}
      />
      <Button
        title="Upload"
        onPress={uploadFiles}
      />
      {/* <Text selectable>Result: {JSON.stringify(result, null, 2)}</Text> */}
    </View>
  );
}


export function Stack4() {


  return (
    <Screens.Navigator>
      <Screens.Screen
        options={{ headerShown: false }}
        name="Options2"
        component={Options}
      />
    </Screens.Navigator>
  );
}

export default Stack4;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
})