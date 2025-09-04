import { create } from "zustand";
import { Plant } from "../../../domain/models";

export type AdoptionState = {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  setPlants: (plants: Plant[]) => void;
  setIsLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
};

export const useAdoptionState = create<AdoptionState>((set: (partial: Partial<AdoptionState>) => void) => ({
  plants: [],
  isLoading: false,
  error: null,
  setPlants: (plants) => set({ plants }),
  setIsLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),
  reset: () => set({ plants: [], isLoading: false, error: null }),
}));
