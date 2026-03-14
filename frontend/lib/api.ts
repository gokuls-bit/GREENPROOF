/**
 * Centralized API layer for GreenProof
 * Handles all HTTP communication with FastAPI backend
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import {
  ClusterResult,
  OptimizationResult,
  TradeDecision,
  EmissionHistoryResponse,
  TransactionHistoryResponse,
  SystemStatus,
  AnalyzeFormInput,
  OptimizeFormInput,
  TradeFormInput,
} from "@/types";

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

interface ApiErrorResponse {
  detail?: string;
  error?: string;
  message?: string;
}

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  originalError: AxiosError;

  constructor(message: string, statusCode: number, originalError: AxiosError) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = "ApiError";
  }
}

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const statusCode = error.response?.status || 500;

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[API Error] ${statusCode}:`,
        message,
        error.response?.data
      );
    }

    return Promise.reject(
      new ApiError(message, statusCode, error)
    );
  }
);

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>();

function getRequestKey(method: string, url: string): string {
  return `${method}:${url}`;
}

// Service: Analyze Emission (Clustering)
export async function analyzeEmission(
  input: AnalyzeFormInput
): Promise<ClusterResult> {
  const endpoint = "/ai/cluster";
  const requestKey = getRequestKey("POST", endpoint);

  // Prevent duplicate requests
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }

  const request = apiClient
    .post<ClusterResult>(endpoint, {
      description: input.description,
    })
    .then((response) => response.data)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);
  return request;
}

// Service: Optimize Emission
export async function optimizeEmission(
  input: OptimizeFormInput
): Promise<OptimizationResult> {
  const endpoint = "/ai/optimize";
  const requestKey = getRequestKey("POST", endpoint);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }

  const request = apiClient
    .post<OptimizationResult>(endpoint, {
      vector_id: input.vectorId,
      target_reduction: input.targetReduction || 0.2,
    })
    .then((response) => response.data)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);
  return request;
}

// Service: Trade Credits
export async function tradeCredits(
  input: TradeFormInput
): Promise<TradeDecision> {
  const endpoint = "/ai/trade";
  const requestKey = getRequestKey("POST", endpoint);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }

  const request = apiClient
    .post<TradeDecision>(endpoint, {
      market_state: input.marketState,
      balance: input.balance,
    })
    .then((response) => response.data)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);
  return request;
}

// Service: Fetch Emission History
export async function fetchEmissionHistory(): Promise<EmissionHistoryResponse> {
  const endpoint = "/emissions/history";
  const requestKey = getRequestKey("GET", endpoint);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }

  const request = apiClient
    .get<EmissionHistoryResponse>(endpoint)
    .then((response) => response.data)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);
  return request;
}

// Service: Fetch Transactions
export async function fetchTransactions(): Promise<TransactionHistoryResponse> {
  const endpoint = "/transactions";
  const requestKey = getRequestKey("GET", endpoint);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }

  const request = apiClient
    .get<TransactionHistoryResponse>(endpoint)
    .then((response) => response.data)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);
  return request;
}

// Service: Check System Health
export async function checkSystemHealth(): Promise<SystemStatus> {
  const endpoint = "/system/status";
  const requestKey = getRequestKey("GET", endpoint);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }

  const request = apiClient
    .get<SystemStatus>(endpoint)
    .then((response) => response.data)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);
  return request;
}

// Utility: Clear cache (manually if needed)
export function clearCache(): void {
  pendingRequests.clear();
}

export default apiClient;
