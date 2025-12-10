#!/usr/bin/env bash
set -e

# Ensure alembic uses env-derived URL
alembic upgrade head

# Start the FastAPI app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000