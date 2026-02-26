from fastapi import APIRouter
from app.services.trading_service import get_trading_history

router = APIRouter(prefix="/trading", tags=["trading"])

@router.get("/history")
async def trading_history():
    return await get_trading_history(None)
