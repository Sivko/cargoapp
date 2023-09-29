import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
} from "react-native-document-picker";

export default function PickerSelecter({ onSelect }) {
  const [result, setResult] = useState([]);

  useEffect(() => {
    // console.log(result);
  }, [result]);

  const handleError = (err) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn("cancelled");
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        "multiple pickers were opened, only the last will be considered",
      );
    } else {
      throw err;
    }
  };

  const deleteFile = (item, index) => {
    console.log(item, index);
    const exceptionDelete = new Set(result);
    exceptionDelete.delete(item);

    setResult(Array.from(exceptionDelete));
  };
  return (
    <View>
      <TouchableOpacity
        style={{ width: 10, height: 10, backgroundColor: 'red' }}
        onPress={async () => {
          try {
            const pickerResult = await DocumentPicker.pick({
              allowMultiSelection: true,
              presentationStyle: "formSheet",
              copyTo: "cachesDirectory",
              mode: "import",
            });
            setResult([...(result || []), ...(pickerResult || [])]);
            onSelect([...(result || []), ...(pickerResult || [])]);
          } catch (e) {
            handleError(e);
          }
        }}
      />
      {result.length > 0 && result && (
        <ScrollView horizontal={true} style={{ width: "70%" }}>
          {result.map((item, index) => (
            // <ItemDocument
            //   key={`ItemDocument_${index}`}
            //   deleteDoc={deleteFile}
            //   document={item}
            //   index={index}
            // />
            <Text> {(JSON.stringify(item), index)}</Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
