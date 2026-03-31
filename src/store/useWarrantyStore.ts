import { create } from "zustand";
import { Warranty, Product } from "@prisma/client";

interface WarrantyWithProduct extends Warranty {
  product: Product;
}

interface WarrantyState {
  warranties: WarrantyWithProduct[];
  isLoading: boolean;
  setWarranties: (warranties: WarrantyWithProduct[]) => void;
  addWarranty: (warranty: WarrantyWithProduct) => void;
}

export const useWarrantyStore = create<WarrantyState>((set) => ({
  warranties: [],
  isLoading: false,
  setWarranties: (warranties) => set({ warranties }),
  addWarranty: (warranty) =>
    set((state) => ({
      warranties: [warranty, ...state.warranties],
    })),
}));
