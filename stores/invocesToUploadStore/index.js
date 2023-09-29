import AsyncStorage from "@react-native-async-storage/async-storage";
import * as zustand from "zustand";

const invocesToUploadStore = zustand.create((set) => ({
  invocesToUpload: [],
  getStorageInvocesToUpload: async () => {
    const storage = await AsyncStorage.getItem("invocesToUpload");
    if (storage === null) return;
    const data = JSON.parse(storage);
    return set({ invocesToUpload: data });
  },
  setStorageInvocesToUpload: async ({ invoice, slots }) => {
    const data = { invoice, slots };
    return set((state) => {
      AsyncStorage.setItem(
        "invocesToUpload",
        JSON.stringify([data, ...state.invocesToUpload]),
      );
      return {
        invocesToUpload: [data, ...state.invocesToUpload],
      };
    });
  },
  resetStorageInvocesToUpload: async (data) => {
    return set((state) => {
      AsyncStorage.setItem("invocesToUpload", JSON.stringify(data));
      return {
        invocesToUpload: data,
      };
    });
  },
  removeStorageInvocesToUpload: async () => {
    await AsyncStorage.setItem("invocesToUpload", "");
    return set((state) => ({ invocesToUpload: [] }));
  },
}));

export default invocesToUploadStore;
