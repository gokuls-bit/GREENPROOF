from fastapi import APIRouter
from app.services.emission_service import get_emissions_history

router = APIRouter(prefix="/emissions", tags=["emissions"])

@router.get("/history")
async def emissions_history():
    return await get_emissions_history(None)
