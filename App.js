import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";

import Login from "./components/Login";
import Tabs from "./navigations/Tabs";
import logginStore from "./stores/logginStore";
import {PermissionsAndroid} from "react-native";

export default function App() {
  const { user, getStorage } = logginStore();
  useEffect(() => {
    getStorage();
    permission()
  }, []);

  const permission =()=>{PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)}  

  return (
    <>
      {user?.id ? (
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      ) : (
        <Login />
      )}
    </>
  );
}
