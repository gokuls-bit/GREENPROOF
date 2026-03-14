/**
 * Emission Store - Zustand state management
 * Handles emission analysis state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClusterResult } from "@/types";

interface EmissionState {
  currentEmission: string | null;
  clusterResult: ClusterResult | null;
  vectorId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentEmission: (emission: string) => void;
  setClusterResult: (result: ClusterResult) => void;
  setVectorId: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEmissionData: () => void;
  resetStore: () => void;
}

const initialState = {
  currentEmission: null,
  clusterResult: null,
  vectorId: null,
  isLoading: false,
  error: null,
};

export const useEmissionStore = create<EmissionState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentEmission: (emission) => set({ currentEmission: emission }),
      
      setClusterResult: (result) =>
        set({
          clusterResult: result,
          vectorId: result.vector_id,
          error: null,
        }),
      
      setVectorId: (id) => set({ vectorId: id }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearEmissionData: () =>
        set({
          currentEmission: null,
          clusterResult: null,
          vectorId: null,
          error: null,
        }),
      
      resetStore: () => set(initialState),
    }),
    {
      name: "emission-store",
      skipHydration: false,
    }
  )
);
