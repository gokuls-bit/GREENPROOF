# GreenProof Backend-Frontend Connection Guide

This guide explains how to set up and run the GreenProof application with both backend and frontend connected.

## Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (for frontend dependency management)
- **Supabase account** (for database)

## Backend Setup

### 1. Install Python Dependencies

Navigate to the backend directory:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_api_key

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Environment
DEBUG=True
LOG_LEVEL=INFO
```

Get your Supabase credentials from your Supabase project dashboard.

### 3. Run the Backend Server

From the `backend/` directory:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start on `http://localhost:8000`

### Available Endpoints

Once the backend is running, you can test these endpoints:

- **Health Check**: `GET http://localhost:8000/health`
- **System Status**: `GET http://localhost:8000/system/status`
- **Authentication**: `POST http://localhost:8000/auth/login`
- **Emissions History**: `GET http://localhost:8000/emissions/history`
- **Analyze Emission**: `POST http://localhost:8000/ai/cluster`
- **Optimize Carbon**: `POST http://localhost:8000/ai/optimize`
- **Execute Trade**: `POST http://localhost:8000/ai/trade`
- **Fetch Transactions**: `GET http://localhost:8000/transactions`
- **Marketplace Farmers**: `GET http://localhost:8000/marketplace/farmers`
- **Trading History**: `GET http://localhost:8000/trading/history`

## Frontend Setup

### 1. Install Node Dependencies

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 2. Verify Environment Configuration

The `.env.local` file should already be configured with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=GreenProof
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

If not, create `.env.local` in the `frontend/` directory with the above content.

### 3. Run the Frontend Development Server

From the `frontend/` directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Testing the Connection

### 1. Verify Backend is Running

Open your browser and visit:
```
http://localhost:8000/health
```

You should see:
```json
{
  "status": "ok",
  "message": "GreenProof backend is running"
}
```

### 2. Test System Status

```bash
curl http://localhost:8000/system/status
```

Should return:
```json
{
  "backend_online": true,
  "ml_models_loaded": true,
  "database_connected": true,
  "timestamp": "2025-02-26T...",
  "latency_ms": 12
}
```

### 3. Access the Frontend

Open your browser and visit:
```
http://localhost:3000
```

The homepage should load and display the dashboard with mock data.

### 4. Test Data Flow (Manual Testing)

1. **Dashboard Page** (`/`) - Should load emission history and transactions
2. **Analyze Page** (`/analyze`) - Should allow you to analyze emissions
3. **Optimization Page** (`/optimization`) - Should show optimization strategies
4. **Trading Page** (`/trading`) - Should show trading decisions
5. **History Page** (`/history`) - Should show past transactions

## API Connection Architecture

### Frontend (React + TypeScript)

The frontend uses **Axios** for HTTP requests with:
- **Base URL**: `http://localhost:8000` (configured in `.env.local`)
- **Timeout**: 10 seconds
- **Request deduplication**: Prevents duplicate requests
- **Global error handling**: Centralized error responses

### Backend (FastAPI)

The backend provides REST endpoints with:
- **CORS enabled**: For `http://localhost:3000`
- **Async handlers**: For non-blocking operations
- **Error handling**: Standardized error responses
- **Service layer**: Business logic separation

### Data Models

Frontend and backend share type definitions through:
- **TypeScript interfaces** (frontend types)
- **Pydantic models** (backend schemas)

Key shared models:
- `ClusterResult` - Emission analysis results
- `OptimizationResult` - Optimization strategies
- `TradeDecision` - Trading recommendations
- `EmissionHistoryResponse` - Historical emission data
- `TransactionHistoryResponse` - Transaction history
- `SystemStatus` - System health metrics

## Troubleshooting

### Backend won't start

```bash
# Check if port 8000 is already in use
lsof -i :8000  # On macOS/Linux
netstat -ano | findstr :8000  # On Windows

# Kill the process or use a different port
python -m uvicorn app.main:app --port 8001
```

### Frontend can't connect to backend

1. Verify backend is running on port 8000
2. Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Check browser console for network errors (F12)
4. Ensure CORS is properly configured in backend

### CORS errors

If you see CORS errors in browser console, ensure `main.py` has:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Dependencies missing

If you get import errors:

```bash
# For backend
pip install -r requirements.txt --upgrade

# For frontend
npm install
```

## Development Workflow

1. **Backend**: Make changes and the `--reload` flag will auto-restart the server
2. **Frontend**: Changes are hot-reloaded automatically
3. **Browser**: Use DevTools (F12) to inspect network requests and responses
4. **Testing**: Use `curl`, Postman, or the browser to test API endpoints

## Next Steps

After successfully connecting frontend to backend:

1. Implement actual database queries in services
2. Integrate ML models for clustering, optimization, and trading
3. Set up authentication with JWT tokens
4. Add error handling and validation
5. Implement logging and monitoring
6. Deploy to production environment

## Support

For issues or questions:
1. Check the error messages in both backend and frontend console
2. Review the API documentation in route files
3. Check the Supabase documentation for database issues
4. Review TypeScript types for data structure validation
