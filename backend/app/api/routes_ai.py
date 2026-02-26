from fastapi import APIRouter
from app.services.optimization_service import cluster_data, optimize_carbon, explain_cluster
from app.services.trading_service import trade_action

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/cluster")
async def cluster_endpoint(payload: dict):
    return await cluster_data(payload, None)

@router.post("/optimize")
async def optimize_endpoint(payload: dict):
    return await optimize_carbon(payload, None)

@router.post("/trade")
async def trade_endpoint(payload: dict):
    return await trade_action(payload, None)

@router.get("/explain/{cluster_id}")
async def explain_endpoint(cluster_id: int):
    return await explain_cluster(cluster_id, None)
