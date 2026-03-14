/**
 * Optimization Store - Zustand state management
 * Handles RL optimization state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OptimizationResult } from "@/types";

interface OptimizationState {
  strategy: string | null;
  rewardScore: number | null;
  expectedReduction: number | null;
  costImpact: number | null;
  confidence: number | null;
  isLoading: boolean;
  error: string | null;
  lastOptimizedVectorId: string | null;
  
  // Actions
  setOptimizationResult: (result: OptimizationResult, vectorId: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearOptimizationData: () => void;
  resetStore: () => void;
}

const initialState = {
  strategy: null,
  rewardScore: null,
  expectedReduction: null,
  costImpact: null,
  confidence: null,
  isLoading: false,
  error: null,
  lastOptimizedVectorId: null,
};

export const useOptimizationStore = create<OptimizationState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setOptimizationResult: (result, vectorId) =>
        set({
          strategy: result.strategy,
          rewardScore: result.reward_score,
          expectedReduction: result.expected_reduction,
          costImpact: result.cost_impact,
          confidence: result.confidence,
          lastOptimizedVectorId: vectorId,
          error: null,
        }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearOptimizationData: () =>
        set({
          strategy: null,
          rewardScore: null,
          expectedReduction: null,
          costImpact: null,
          confidence: null,
          lastOptimizedVectorId: null,
          error: null,
        }),
      
      resetStore: () => set(initialState),
    }),
    {
      name: "optimization-store",
      skipHydration: false,
    }
  )
);
