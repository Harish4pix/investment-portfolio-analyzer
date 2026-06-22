# services/price_service.py
#
# Fetches live stock prices from Yahoo Finance.
#
# WHY YFINANCE:
# It's free, has no API key requirement, and covers NSE/BSE stocks
# by appending ".NS" (NSE) or ".BO" (BSE) to the ticker symbol.
# Example: RELIANCE on NSE = "RELIANCE.NS" in Yahoo Finance's system.

import yfinance as yf
from typing import List, Dict
import asyncio
from concurrent.futures import ThreadPoolExecutor

# yfinance is NOT async-native — it blocks while fetching data.
# We use a ThreadPoolExecutor to run it in a background thread,
# so FastAPI's async event loop doesn't freeze while waiting.
executor = ThreadPoolExecutor(max_workers=8)


def _fetch_single_price(ticker: str) -> Dict:
    """
    Fetches live price data for ONE ticker.
    This runs in a background thread (see fetch_prices below).
    """
    try:
        # Append .NS for NSE-listed stocks (most Indian retail stocks)
        yf_ticker = f"{ticker}.NS"
        stock = yf.Ticker(yf_ticker)

        # .fast_info is yfinance's lightweight, faster price-only endpoint
        # (avoids fetching company profile, financials, etc. we don't need)
        info = stock.fast_info

        ltp = info.last_price
        prev_close = info.previous_close
        change = ltp - prev_close if (ltp and prev_close) else 0
        change_pct = (change / prev_close * 100) if prev_close else 0

        return {
            "ticker": ticker,
            "ltp": round(ltp, 2) if ltp else None,
            "prev_close": round(prev_close, 2) if prev_close else None,
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "success": True,
        }
    except Exception as e:
        # If a ticker is invalid/delisted/typo'd, don't crash the whole batch —
        # return a clear failure marker for THIS ticker only.
        return {
            "ticker": ticker,
            "ltp": None,
            "prev_close": None,
            "change": None,
            "change_pct": None,
            "success": False,
            "error": str(e),
        }


async def fetch_prices(tickers: List[str]) -> List[Dict]:
    """
    Fetches live prices for MULTIPLE tickers in parallel.

    WHY PARALLEL:
    If a user has 20 holdings and we fetched prices one at a time,
    that's 20 sequential network calls — very slow.
    Running them in parallel threads cuts total wait time dramatically.
    """
    loop = asyncio.get_event_loop()
    tasks = [
        loop.run_in_executor(executor, _fetch_single_price, ticker)
        for ticker in tickers
    ]
    results = await asyncio.gather(*tasks)
    return results