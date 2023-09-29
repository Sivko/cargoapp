import * as zustand from "zustand";

const loadingStore = zustand.create((set) => ({
  loading: false,
  setLoading: (state) => {
    return set({ loading: state });
  },
}));

export default loadingStore;
