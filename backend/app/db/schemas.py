from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User Models
class User(BaseModel):
    id: str
    email: str
    username: str
    balance: float = 0.0
    credits_owned: float = 0.0
    joined_date: str

# Emission Models
class EmissionRecord(BaseModel):
    id: str
    user_id: str
    description: str
    value: float
    co2_amount: float
    cluster_label: str
    vector_id: str
    timestamp: datetime
    confidence: float = 0.0
    anomaly_score: float = 0.0

class EmissionHistoryResponse(BaseModel):
    items: List[EmissionRecord]
    total_emissions: float
    average_cluster: str

# Clustering Models
class ClusterResult(BaseModel):
    cluster_label: str
    anomaly_score: float
    shap_summary: str
    vector_id: str
    co2_estimate: float
    confidence: float

# Optimization Models
class OptimizationResult(BaseModel):
    strategy: str
    expected_reduction: float
    reward_score: float
    cost_impact: float
    confidence: float

# Trading Models
class TradeDecision(BaseModel):
    action: str  # "BUY" | "SELL" | "HOLD"
    confidence: float
    projected_profit: float
    reasoning: str
    risk_level: str  # "LOW" | "MEDIUM" | "HIGH"

class Transaction(BaseModel):
    id: str
    user_id: str
    timestamp: datetime
    type: str  # "BUY" | "SELL"
    amount: float
    price: float
    total: float
    status: str  # "PENDING" | "COMPLETED" | "FAILED"

class TransactionHistoryResponse(BaseModel):
    transactions: List[Transaction]
    total_volume: float
    total_trades: int

# Marketplace Models
class Farmer(BaseModel):
    id: str
    name: str
    location: str
    available_credits: float
    price_per_credit: float
    rating: float = 0.0
    verified: bool = False

class FarmersResponse(BaseModel):
    farmers: List[Farmer]

# System Models
class SystemStatus(BaseModel):
    backend_online: bool
    ml_models_loaded: bool
    database_connected: bool
    timestamp: str
    latency_ms: int
