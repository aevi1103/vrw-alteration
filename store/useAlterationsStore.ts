import { type } from "os";
import { create } from "zustand";

type AlterationsState = {
  visible: boolean;
  toggle: () => void;
};

export const useAlterationsStore = create<AlterationsState>((set) => ({
  visible: false,
  toggle: () => set((state) => ({ visible: !state.visible })),
}));
