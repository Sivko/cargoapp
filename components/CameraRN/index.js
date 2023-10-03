// import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import Canvas from 'react-native-canvas';
var RNFS = require('react-native-fs');
import Marker, { ImageFormat, Position, TextBackgroundType } from "react-native-image-marker"

// const Screens = createNativeStackNavigator();


function Options({ route }) {

  const { setPhotos, lorem, navigation } = route.params;

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
      const options = {};
      const data = await camera.takePictureAsync(options);
      save(data);
      // console.log(data);
    }
  };

  async function save(data) {
    const filename = `${new Date().getTime()}.jpeg`;
    try {
      const pp = await RNFS.moveFile(data.uri, `${RNFS.PicturesDirectoryPath}/${filename}`);
      // const rr = await RNFS.stat(`file://${RNFS.PicturesDirectoryPath}/${filename}`).catch(e => console.log(e, ":("))
      // console.log(rr,"RR");
      setPhotos(prev => [{ name: filename, type: 'image/jpeg', fileCopyUri: `file://${RNFS.PicturesDirectoryPath}/${filename}`, uri: `file://${RNFS.PicturesDirectoryPath}/${filename}` }, ...prev])
      navigation.goBack();
      // console.log(`${RNFS.PicturesDirectoryPath}/${filename}`)
      // let formData = new FormData();
      // formData.append("file", {
      //   name: filename,
      //   type: 'image/jpeg',
      //   uri: `file://${RNFS.PicturesDirectoryPath}/${filename}`,
      //   // fileCopyUri: `file://${RNFS.PicturesDirectoryPath}/${filename}`,
      //   // filepath: `${RNFS.PicturesDirectoryPath}/${filename}`
      // });
      // const uploadData = await axios.post('https://webhook.site/4ad96567-239e-4ac7-98b5-c52cd1ec9b7b',
      //   formData).catch(e=>console.log(e.message));
    } catch (err) { console.log(err) }
  }


  return (
    <View style={styles.container}>
      {/* <View style={{ marginTop: 0, alignItems: 'center', justifyContent: 'center', marginEnd: 12 }}>
        {newImage && <Image style={{ width: 200, height: 200, backgroundColor: '#ddd' }} source={{ uri: newImage}} />}
      </View>
      <Text style={{ color: '#FFF' }}>CANVAS:</Text> */}
      {/* <Canvas ref={handleCanvas} /> */}
      {/* {photos.map(e => (<View style={{ flex: 1 }} >
        <View style={{ height: 200, width: '100%', flexDirection: 'row', flexWrap: 'nowrap' }}>
          <ScrollView horizontal={true} style={{ flex: 1 }}>
            <Image style={{ height: 'auto', flexBasis: '10%', width: '10%', flex: 1 }} source={{ uri: e.uri }} />
          </ScrollView>
        </View>
      </View>))} */}
      {/* {result && (<View style={{ flex: 1, width: '100%', height: 100 }}>
        <Text>Photo:</Text>
        <Image style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: result.uri }} />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => { }} style={{ borderRadius: 100, backgroundColor: "#303030", padding: 20 }}>
            <AntDesign name="check" size={30} color="#d3d3d3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setResult(null)} style={{ borderRadius: 100, backgroundColor: "#303030", padding: 20 }}>
            <AntDesign name="close" size={30} color="#d3d3d3" />
          </TouchableOpacity>
        </View>
      </View>)} */}
      <View style={{ flex: 1, width: '100%', height: 100 }}>

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
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', position: 'absolute', width: '100%', bottom: 0 }}>
          <TouchableOpacity onPress={() => takePicture()} style={{ borderRadius: 100, backgroundColor: "#303030", padding: 20 }}>
            <AntDesign name="camerao" size={30} color="#d3d3d3" />
          </TouchableOpacity>
        </View>
      </View>
      {/* <Button
        title="open picker for multi file selection"
        onPress={() => {
          DocumentPicker.pick({ allowMultiSelection: true, type: types.images, copyTo: 'documentDirectory' }).then(setPhotos).catch(handleError)
        }}
      />
      <Button
        title="Upload"
        onPress={uploadFiles}
      /> */}
      {/* <Text selectable>Result: {JSON.stringify(result, null, 2)}</Text> */}
    </View>
  );
}

export default Options;


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