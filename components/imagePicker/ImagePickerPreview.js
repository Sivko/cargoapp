import React, { useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { openPicker } from '@baronha/react-native-multiple-image-picker';

import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerPreview({ children }) {
  const [images, setImages] = useState(null);
  const onPicker = async () => {
    try {
      const singleSelectedMode = true;

      const response = await openPicker({
        selectedAssets: images,
        isExportThumbnail: true,
        maxVideo: 1,
        doneTitle: 'Xong',
        singleSelectedMode,
        isCrop: true,
      });

      const crop = response.crop;

      if (crop) {
        response.path = crop.path;
        response.width = crop.width;
        response.height = crop.height;
      }

      setImages(response);
    } catch (e) {}
  };

  const pickImages = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 5,
      allowsMultipleSelection: true
    });

    console.log(result);

    if (!result.canceled) {
      setImages(result.assets.map((e) => e.uri));
    }
  };

  return (
    <TouchableOpacity onPress={onPicker} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {!!images && (<View>
        {images?.map((image, index) => <Image key={index} source={{ uri: image }} style={{ width: 200, height: 200 }} />)}
      </View>
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  images: {
    flex: 1,
    justifyContent: 'space-between',
    gap: '10px'
  }
})