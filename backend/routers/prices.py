# routers/prices.py
#
# Defines the HTTP endpoint the frontend calls to get live prices.
# URL will be: POST /prices/batch

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.price_service import fetch_prices

router = APIRouter()


class TickerRequest(BaseModel):
    """Shape of the request body the frontend sends."""
    tickers: List[str]


@router.post("/batch")
async def get_batch_prices(request: TickerRequest):
    """
    POST /prices/batch
    Body: { "tickers": ["RELIANCE", "TCS", "INFY"] }

    Returns live LTP, previous close, and change% for each ticker.
    """
    if not request.tickers:
        return {"prices": []}

    results = await fetch_prices(request.tickers)
    return {"prices": results}