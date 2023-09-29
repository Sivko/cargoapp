import { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

// import { setInvoceInfo } from "../requests/local/getSetInfoInvoce";

function AddInvoices({ navigation }) {
  const [clientCode, setClientCode] = useState("");
  const [numberTTN, setNumberTTN] = useState("");
  const [countBox, setCountBox] = useState("");

  // useEffect(() => {
  //   setInvoceInfo({
  //     clientCode,
  //     numberTTN,
  //     countBox,
  //   });
  // }, [clientCode, numberTTN, countBox]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(e) => setClientCode(e)}
        keyboardType="numeric"
        value={clientCode.toString()}
        placeholder="Код клиента"
      />
      <TextInput
        style={styles.input}
        onChangeText={(e) => setNumberTTN(e)}
        keyboardType="numeric"
        value={numberTTN.toString()}
        placeholder="Номер ТТН"
      />
      <TextInput
        style={styles.input}
        onChangeText={(e) => setCountBox(e)}
        keyboardType="numeric"
        value={countBox.toString()}
        placeholder="Кол-во коробок"
      />
      <Button
        title="Оформить"
        disabled={!(clientCode.length > 3)}
        onPress={() =>
          navigation.push("Оформить", { clientCode, numberTTN, countBox })
        }
      />
      <Button
        title="Квитанции"
        onPress={() => navigation.navigate("Квитанции")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "90%",
    marginHorizontal: "5%",
  },
  input: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: "100%",
  },
  errors: {
    color: "#fc2847",
  },
});

export default AddInvoices;
