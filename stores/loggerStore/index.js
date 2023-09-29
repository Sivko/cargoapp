import AsyncStorage from "@react-native-async-storage/async-storage";
import * as zustand from "zustand";

// export const loggerBoolStore = zustand.create((set) => ({
//   logBool: false,
//   getLoggerBoolStore: async () => {
//     const storage = await AsyncStorage.getItem("logBool");
//     if (storage === null) return;
//     const data = JSON.parse(storage);
//     return set({ logBool: data });
//   },
//   setLoggerBoolStore: async (val) => {
//     const data = val;
//     return set((state) => {
//       AsyncStorage.setItem("logBool", JSON.stringify(val));
//       return {
//         logBool: data,
//       };
//     });
//   },
// }));

const loggerStore = zustand.create((set) => {
  // const { logBool } = loggerBoolStore();
  return {
    logs: [],
    getLoggerStore: async () => {
      const storage = await AsyncStorage.getItem("logs");
      if (storage === null) return;
      const data = JSON.parse(storage);
      return set({ logs: data });
    },
    setLoggerStore: async (data) => {
      // if (!logBool) return;
      return set((state) => {
        AsyncStorage.setItem("logs", JSON.stringify([data, ...state.logs]));
        return {
          logs: [data, ...state.logs],
        };
      });
    },
    removeLoggerStore: async () => {
      await AsyncStorage.setItem("logs", "");
      return set((state) => ({ logs: [] }));
    },
  };
});

export default loggerStore;
