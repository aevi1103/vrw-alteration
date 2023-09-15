import { create } from "zustand";

type HeaderState = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const useMenuHeaderStore = create<HeaderState>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
