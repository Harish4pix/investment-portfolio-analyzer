# main.py — FastAPI Application Entry Point
#
# This is where the backend server starts.
# Every API route is registered here.
# Run with: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
# (API keys, secrets — never hardcode these)
load_dotenv()

# Create the FastAPI app instance
app = FastAPI(
    title="IPA — Investment Portfolio Analyzer API",
    description="Backend API for live prices, risk metrics, tax calculations",
    version="1.0.0",
)

# CORS — Cross Origin Resource Sharing
# Without this, the browser BLOCKS requests from
# localhost:5173 (React) to localhost:8000 (FastAPI)
# because they are on different ports = different "origins"
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # React dev server
        "http://localhost:4173",   # React preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Import routers ──────────────────────────────────────────────
# Each router handles one domain of functionality.
# We import them here and register with a URL prefix.
# Phase 2+ will uncomment these one by one.

# from routers.prices  import router as prices_router
# from routers.portfolio import router as portfolio_router
# from routers.tax     import router as tax_router
# from routers.risk    import router as risk_router

# app.include_router(prices_router,    prefix="/prices",    tags=["Prices"])
# app.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])
# app.include_router(tax_router,       prefix="/tax",       tags=["Tax"])
# app.include_router(risk_router,      prefix="/risk",      tags=["Risk"])

# ── Health Check ────────────────────────────────────────────────
# Always have a health check endpoint.
# Used to verify server is running.
# Vercel/Railway also ping this to check if deployment is alive.
@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "IPA API running",
        "version": "1.0.0",
    }

@app.get("/ping")
def ping():
    return {"ping": "pong"}