import AsyncStorage from "@react-native-async-storage/async-storage";
import * as zustand from "zustand";

const logginStore = zustand.create((set) => ({
  user: {},
  getStorage: async () => {
    const storage = await AsyncStorage.getItem("user");
    if (storage === null) return;
    const data = JSON.parse(storage);
    return set({ user: { ...data } });
  },
  loggin: async ({ id, firstName, lastName, email, token }) => {
    const data = { id, firstName, lastName, email, token };
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return set((state) => ({
      user: data,
    }));
  },
  unloggin: async () => {
    await AsyncStorage.setItem("user", "");
    return set((state) => ({ user: {} }));
  },
}));

export default logginStore;
