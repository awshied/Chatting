import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "Vendetta", _id: 123, age: 72 },
  isLoggedIn: false,
  isLoading: false,

  login: () => {
    console.log("Kita baru saja login :V");
    set({ isLoggedIn: true, isLoading: true });
  },
}));
