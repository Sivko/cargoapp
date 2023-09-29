import config from "@/requests/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as zustand from "zustand";

const scanStore = zustand.create((set) => ({
  scanItems: [],
  idFlightsToDownloads: [],
  getStoragescanItems: async () => {
    const storage = await AsyncStorage.getItem("scanItems");
    if (storage === null) return;
    const data = JSON.parse(storage || "[]");
    return set({ scanItems: data });
  },
  setIdFlightsToDownloads: (data) => {
    return(set({idFlightsToDownloads: data}))
  },
  setStoragescanItems: async ({ invoice, slots }) => {
    const data = { invoice, slots };
    return set((state) => {
      AsyncStorage.setItem(
        "scanItems",
        JSON.stringify([data, ...state.scanItems]),
      );
      return {
        scanItems: [data, ...state.scanItems],
      };
    });
  },
  resetStoragescanItems: async (data) => {
    return set((state) => {
      AsyncStorage.setItem("scanItems", JSON.stringify(data));
      return {
        scanItems: data,
      };
    });
  },
  // downloadFlights: async ()=> {
  //   const url = "https://app.salesap.ru/api/v1/deals?filter[deal-stage-id]=327688" /* сделки на этапе фрахтования */
  //   console.log("SEND")
  //   const res = await axios.get(url, config);
  //   const data = res.data.data.map(e => ({ flight: { data: e } }))
  //   AsyncStorage.setItem("scanItems", JSON.stringify(data));
  //   return {
  //     scanItems: data,
  //   };
  // },
  removeStoragescanItems: async () => {
    await AsyncStorage.setItem("scanItems", "");
    return set((state) => ({ scanItems: [] }));
  },
}));

export default scanStore;
