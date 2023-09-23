import { Item } from "@/lib/types/alteration";
import { create } from "zustand";

type AlterationsState = {
  visible: boolean;
  toggle: () => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  expanded: boolean;
  toggleExpanded: () => void;
};

export const useAlterationsStore = create<AlterationsState>((set) => ({
  visible: false,
  toggle: () => set((state) => ({ visible: !state.visible })),
  items: [],
  setItems: (items) => set(() => ({ items })),
  itemsDrawerVisible: false,
  expanded: false,
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
}));
