/**
 * Trading Store - Zustand state management
 * Handles carbon trading state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TradeDecision } from "@/types";

interface TradingState {
  action: "BUY" | "SELL" | "HOLD" | null;
  confidence: number | null;
  projectedProfit: number | null;
  reasoning: string | null;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
  isLoading: boolean;
  error: string | null;
  tradeHistory: TradeDecision[];
  
  // Actions
  setTradeDecision: (decision: TradeDecision) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToTradeHistory: (decision: TradeDecision) => void;
  clearTradeData: () => void;
  resetStore: () => void;
}

const initialState = {
  action: null,
  confidence: null,
  projectedProfit: null,
  reasoning: null,
  riskLevel: null,
  isLoading: false,
  error: null,
  tradeHistory: [] as TradeDecision[],
};

export const useTradingStore = create<TradingState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTradeDecision: (decision) =>
        set({
          action: decision.action,
          confidence: decision.confidence,
          projectedProfit: decision.projected_profit,
          reasoning: decision.reasoning,
          riskLevel: decision.risk_level,
          error: null,
        }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      addToTradeHistory: (decision) =>
        set((state) => ({
          tradeHistory: [decision, ...state.tradeHistory].slice(0, 50), // Keep last 50
        })),
      
      clearTradeData: () =>
        set({
          action: null,
          confidence: null,
          projectedProfit: null,
          reasoning: null,
          riskLevel: null,
          error: null,
        }),
      
      resetStore: () => set(initialState),
    }),
    {
      name: "trading-store",
      skipHydration: false,
    }
  )
);
