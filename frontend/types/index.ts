/**
 * Type definitions for GreenProof frontend
 */

// API Response Types
export interface ClusterResult {
  cluster_label: string;
  anomaly_score: number;
  shap_summary: string;
  vector_id: string;
  co2_estimate: number;
  confidence: number;
}

export interface OptimizationResult {
  strategy: string;
  expected_reduction: number;
  reward_score: number;
  cost_impact: number;
  confidence: number;
}

export interface TradeDecision {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  projected_profit: number;
  reasoning: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
}

export interface EmissionHistoryItem {
  id: string;
  timestamp: string;
  description: string;
  co2_amount: number;
  cluster_label: string;
  vector_id: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
  total: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface SystemStatus {
  backend_online: boolean;
  ml_models_loaded: boolean;
  database_connected: boolean;
  timestamp: string;
  latency_ms: number;
}

export interface EmissionHistoryResponse {
  items: EmissionHistoryItem[];
  total_emissions: number;
  average_cluster: string;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total_volume: number;
  total_trades: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

// Form Input Types
export interface AnalyzeFormInput {
  description: string;
}

export interface OptimizeFormInput {
  vectorId: string;
  targetReduction?: number;
}

export interface TradeFormInput {
  marketState: Record<string, number>;
  balance: number;
}
