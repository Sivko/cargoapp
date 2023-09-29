import * as zustand from "zustand";

const pressedStore = zustand.create((set) => ({
  press: false,
  setPress: (state) => {
    return set({ press: state });
  },
}));

export default pressedStore;
