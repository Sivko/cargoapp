import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from "react";
// import * as React from "react";
import { Button, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import RNFS from 'react-native-fs';
import Marker, { ImageFormat, Position, TextBackgroundType } from "react-native-image-marker"
import ImageView from "react-native-image-viewing";


const Screens = createNativeStackNavigator();


function Options() {

  const { user } = logginStore()
  const [file, setFile] = useState(`${RNFS.PicturesDirectoryPath}/file3.jpg`)
  const [visible, setIsVisible] = useState(false);

  // console.log(user)
  // useEffect(()=> {console.log(file)},[file]);

  useEffect(()=> {
    console.log(user)
  },[])
  // useEffect(() => {
  //   RNFS.unlink(`${RNFS.PicturesDirectoryPath}/file3.jpg`)
  //     .then(() => {
  //       console.log('FILE DELETED');
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }, [])

  async function downloadFile() {
    const res = await RNFS.downloadFile({
      fromUrl: 'https://app.salesap.ru/documents/3985545/download?expires=1696364957&signature=c3d913411c65bb2e176a0fe164d9e1b92325d8cd46327b2ff585014d8463f808&user_id=77292',
      toFile: `${RNFS.PicturesDirectoryPath}/file3.jpg`,
      headers: {
        Authorization: `Bearer mUYmfdF5Hr0zUC9b3WLmR94p_DH4-GPkdQ42FmBZpv0`,
      }
    }).promise.then((response) => {
      console.log('File downloaded!', response);
      setFile(`${RNFS.PicturesDirectoryPath}/file3.jpg`)
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => setIsVisible(true)} title="open" />
      {/* <Image source={{uri: `file://${RNFS.PicturesDirectoryPath}/file3.jpg`}} style={{flex: 1, width: '100%'}} /> */}
      {/* <Image source={{uri: `file://${file}`}} style={{flex: 1, width: '100%'}} />
      <Button title={"downloadFile"} onPress={downloadFile} /> */}
      {/* <ImageGallery
        style={{ flex: 1, backgroundColor: 'black' }}
        images={[
          { id:1 ,source: { url: `content://${RNFS.PicturesDirectoryPath}/file3.jpg`,  } },
          { id: 2,source: { url: `content://${RNFS.PicturesDirectoryPath}/file2.jpg`, } },
        ]}
      /> */}
      {/* <TextInput
        value={String(JSON.stringify(user))}
      /> */}
      <ImageView
        style={{ flex: 1, backgroundColor: 'black' }}
        imageIndex={1}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}

        images={[
          { uri: `file://${RNFS.PicturesDirectoryPath}/file3.jpg` },
          { uri: `file://${RNFS.PicturesDirectoryPath}/file2.jpg` },
        ]}
      />
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
    width: '90%'
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