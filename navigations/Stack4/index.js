import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
// import * as React from "react";
import { Button, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import { RNCamera } from 'react-native-camera';

const Screens = createNativeStackNavigator();


function Options() {

  const [result, setResult] = useState()

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2))
  }, [result])


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
      console.log(data.uri);
    }
  };

  return (
    <View style={styles.container}>
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
        // androidRecordAudioPermissionOptions={{
        //   title: 'Permission to use audio recording',
        //   message: 'We need your permission to use your audio',
        //   buttonPositive: 'Ok',
        //   buttonNegative: 'Cancel',
        // }}
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={()=>takePicture()} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> SNAP </Text>
        </TouchableOpacity>
      </View>
      {/* <Button
        title="open picker for multi file selection"
        onPress={() => {
          DocumentPicker.pick({ allowMultiSelection: true, type: types.images }).then(setResult).catch(handleError)
        }}
      /> */}
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