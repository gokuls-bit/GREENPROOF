/**
 * Utility hooks for API interactions
 */

import { useCallback, useState } from "react";
import { ApiError, analyzeEmission, optimizeEmission, tradeCredits, fetchEmissionHistory, fetchTransactions, checkSystemHealth } from "@/lib/api";
import { AnalyzeFormInput, OptimizeFormInput, TradeFormInput } from "@/types";
import { useEmissionStore } from "@/store/emissionStore";
import { useOptimizationStore } from "@/store/optimizationStore";
import { useTradingStore } from "@/store/tradingStore";

// Hook for analyzing emissions
export function useAnalyzeEmission() {
  const { setClusterResult, setIsLoading, setError } = useEmissionStore();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const analyze = useCallback(
    async (input: AnalyzeFormInput) => {
      setIsLoadingLocal(true);
      setIsLoading(true);
      setError(null);

      try {
        const result = await analyzeEmission(input);
        setClusterResult(result);
        return result;
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to analyze emission";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
        setIsLoadingLocal(false);
      }
    },
    [setClusterResult, setIsLoading, setError]
  );

  return { analyze, isLoading: isLoadingLocal };
}

// Hook for optimization
export function useOptimizeEmission() {
  const { setOptimizationResult, setIsLoading, setError } = useOptimizationStore();
  const { vectorId } = useEmissionStore();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const optimize = useCallback(
    async (input: OptimizeFormInput) => {
      if (!vectorId) {
        setError("No emission analyzed. Please analyze an emission first.");
        return;
      }

      setIsLoadingLocal(true);
      setIsLoading(true);
      setError(null);

      try {
        const result = await optimizeEmission(input);
        setOptimizationResult(result, vectorId);
        return result;
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to optimize emission";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
        setIsLoadingLocal(false);
      }
    },
    [vectorId, setOptimizationResult, setIsLoading, setError]
  );

  return { optimize, isLoading: isLoadingLocal };
}

// Hook for trading
export function useTrade() {
  const { setTradeDecision, setIsLoading, setError, addToTradeHistory } = useTradingStore();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const trade = useCallback(
    async (input: TradeFormInput) => {
      setIsLoadingLocal(true);
      setIsLoading(true);
      setError(null);

      try {
        const result = await tradeCredits(input);
        setTradeDecision(result);
        addToTradeHistory(result);
        return result;
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to execute trade";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
        setIsLoadingLocal(false);
      }
    },
    [setTradeDecision, setIsLoading, setError, addToTradeHistory]
  );

  return { trade, isLoading: isLoadingLocal };
}

// Hook for fetching emission history
export function useFetchEmissionHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchEmissionHistory();
      return result;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to fetch emission history";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, isLoading, error };
}

// Hook for fetching transactions
export function useFetchTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTransactions();
      return result;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to fetch transactions";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, isLoading, error };
}

// Hook for system health check
export function useSystemHealth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await checkSystemHealth();
      return result;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to check system status";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { check, isLoading, error };
}
