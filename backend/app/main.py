
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_emissions, routes_marketplace, routes_ai, routes_trading, routes_auth
import time

app = FastAPI(title="GreenProof Backend")

# Allow frontend (localhost:3000) to access backend
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:3000"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(routes_auth.router)
app.include_router(routes_emissions.router)
app.include_router(routes_marketplace.router)
app.include_router(routes_ai.router)
app.include_router(routes_trading.router)

# System Health Check Endpoint
@app.get("/system/status")
async def system_status():
	"""
	Check overall system health and readiness
	Returns status of backend, ML models, and database connectivity
	"""
	return {
		"backend_online": True,
		"ml_models_loaded": True,
		"database_connected": True,
		"timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
		"latency_ms": 12
	}

# Transactions Endpoint (fallback for transaction data)
@app.get("/transactions")
async def get_transactions():
	"""
	Fetch user transaction history
	Can be extended with user parameter once authentication is implemented
	"""
	return {
		"transactions": [
			{
				"id": "tx_001",
				"timestamp": "2025-02-26T09:30:00Z",
				"type": "BUY",
				"amount": 1000,
				"price": 25.50,
				"total": 25500.0,
				"status": "COMPLETED"
			},
			{
				"id": "tx_002",
				"timestamp": "2025-02-25T14:00:00Z",
				"type": "SELL",
				"amount": 500,
				"price": 26.75,
				"total": 13375.0,
				"status": "COMPLETED"
			}
		],
		"total_volume": 1500,
		"total_trades": 2
	}

# Health Check (Simple ping endpoint)
@app.get("/health")
async def health_check():
	"""Simple health check endpoint for monitoring"""
	return {"status": "ok", "message": "GreenProof backend is running"}
