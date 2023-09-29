import axios from "axios";
import { useEffect, useState } from "react";
import { View, Image, TextInput, Text, Button, StyleSheet } from "react-native";

import config, { fields } from "@/requests/config";
import logginStore from "@/stores/logginStore";

function Login() {
  const { user, loggin } = logginStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (email && password && submit) {
      setSubmit(false);
    }
  }, [email, password]);

  const auth = async () => {
    setSubmit(true);
    setErrors(() => {
      const err = [];
      if (!email) err.push("Укажите логин");
      if (!password) err.push("Укажите пароль");
      return err;
    });
    if (email && password) {
      try {
        const res = await axios.get(
          `https://app.salesap.ru/api/v1/users?filter[email]=${encodeURI(
            email,
          )}`,
          config(user?.token),
        );
        const data = res.data?.data[0];
        if (res.status !== 200) {
          await setErrors([JSON.stringify(...res.data.errors)]);
          return;
        }
        if (data?.attributes?.email !== email) {
          await setErrors(["Email не найден"]);
          return;
        }
        if (!data.attributes?.customs[fields["userPassword"]]) {
          await setErrors(["У пользователя не задан пароль в настройках"]);
          return;
        }
        if (password != data.attributes.customs[fields["userPassword"]]) {
          await setErrors(["Неверный пароль"]);
          return;
        }
        if (data.attributes.customs[fields["userToken"]] === "") {
          await setErrors(["У пользователя не указан Токен, укажите его в приложении СРМ"]);
          return;
        }
        loggin({
          id: data.id,
          token: data.attributes.customs[fields["userToken"]],
          ...data.attributes,
        });
      } catch (error) {
        setErrors([JSON.stringify(error)]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 100, height: 100 }}
        source={require("../../assets/logo-v2.png")}
      />
      <TextInput
        style={styles.input}
        onChangeText={(e) => setEmail(e.toLowerCase())}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="username"
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={(e) => setPassword(e)}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        textContentType="password"
      />
      {/* <Text>{errors.length}</Text> */}
      {errors.map((e, index) => {
        return (
          <Text key={index} style={styles.errors}>
            {e}
          </Text>
        );
      })}
      <Button title="Войти" onPress={auth} />
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

export default Login;
