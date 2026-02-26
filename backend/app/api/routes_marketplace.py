from fastapi import APIRouter
from app.services.marketplace_service import buy_credits, get_farmers

router = APIRouter(prefix="/marketplace", tags=["marketplace"])

@router.post("/buy")
async def buy_marketplace_credits(payload: dict):
    return await buy_credits(payload, None)

@router.get("/farmers")
async def list_farmers():
    return await get_farmers(None)
