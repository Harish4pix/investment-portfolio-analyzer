# models/portfolio.py
#
# Pydantic models define the SHAPE of data.
# FastAPI uses these to:
#   1. Validate incoming request data automatically
#   2. Generate API documentation
#   3. Serialize response data
#
# Think of these as "contracts" between frontend and backend.

from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class AssetType(str, Enum):
    STOCK = "Stock"
    MF    = "MF"         # Mutual Fund

class Exchange(str, Enum):
    NSE  = "NSE"
    BSE  = "BSE"
    AMFI = "AMFI"        # For mutual funds

# ── Single Holding ──────────────────────────────────────────────
class Holding(BaseModel):
    ticker:    str                        # e.g. "RELIANCE"
    name:      str                        # e.g. "Reliance Industries"
    type:      AssetType = AssetType.STOCK
    qty:       float                      # Number of shares/units
    avg_price: float                      # Average buy price
    ltp:       Optional[float] = None     # Last Traded Price (live)
    sector:    Optional[str]  = "Other"
    exchange:  Exchange = Exchange.NSE
    isin:      Optional[str]  = None      # Unique stock identifier
    elss:      bool = False               # Is this an ELSS fund?

    # Computed fields (calculated in backend, sent to frontend)
    invested:  Optional[float] = None     # qty * avg_price
    current:   Optional[float] = None     # qty * ltp
    gain:      Optional[float] = None     # current - invested
    roi_pct:   Optional[float] = None     # (gain / invested) * 100
    hold_days: Optional[int]   = None     # Days since purchase
    is_ltcg:   Optional[bool]  = None     # Hold > 365 days?
    tax_amt:   Optional[float] = None     # Estimated tax liability

# ── Full Portfolio ──────────────────────────────────────────────
class Portfolio(BaseModel):
    holdings: List[Holding]
    source:   Optional[str] = None        # 'kite' | 'groww' | 'manual'

# ── Manual Entry Request ────────────────────────────────────────
class ManualHolding(BaseModel):
    ticker:    str
    name:      Optional[str] = None
    type:      AssetType = AssetType.STOCK
    qty:       float
    avg_price: float
    sector:    Optional[str] = "Other"
    exchange:  Exchange = Exchange.NSE
    elss:      bool = False

# ── Price Response ──────────────────────────────────────────────
class PriceResponse(BaseModel):
    ticker:    str
    ltp:       float
    change:    float       # Absolute change from prev close
    change_pct: float      # % change from prev close
    prev_close: float
    volume:    Optional[int] = None