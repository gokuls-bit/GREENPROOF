# 🚀 GreenProof Frontend - Quick Start Guide

## ✅ Status: Production Build Complete

The GreenProof frontend is fully built and running!

### Current Server Status
- **Development Server**: ✅ Running on http://localhost:3000
- **Build Status**: ✅ All 5 routes pre-rendered successfully
- **Dependencies**: ✅ 413 packages installed (0 vulnerabilities)
- **TypeScript**: ✅ Full type safety enabled
- **Styling**: ✅ Tailwind CSS with custom GreenProof theme

## 📋 Next Steps

### 1. **Start the Backend** (REQUIRED)
The frontend expects the FastAPI backend running at `http://localhost:8000`.

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The frontend will show a **⚠️ Backend Offline** indicator until the backend is running.

### 2. **Access the Frontend**
The dev server is already running:
- **URL**: http://localhost:3000
- **Pages Available**:
  - ✅ `/` - Dashboard with KPIs and charts
  - ✅ `/analyze` - Emission clustering interface
  - ✅ `/optimization` - RL strategy recommendations
  - ✅ `/trading` - DQN trading decisions
  - ✅ `/history` - Emission & transaction data

### 3. **Test the API Integration**
Once both servers are running:

1. **Dashboard** - Should show:
   - Green "Backend Online" indicator in header
   - KPI cards (will load from API or show loading state)
   - Charts showing emission trends

2. **Analyze Page** - Try:
   - Enter an emission description
   - Click "Analyze Emission"
   - Should see cluster results if `/ai/cluster` endpoint works

3. **Check System Health**
   - Header continuously polls `GET /system/status`
   - Indicator shows green (online) or red (offline)

## 🔧 Available Commands

```bash
# Development (already running)
npm run dev

# Production build
npm run build
npm start

# Type checking
npx tsc --noEmit

# Format code
npm run format

# Lint code
npm run lint
```

## 📁 Project Structure

```
frontend/
├── app/                 # Next.js pages
├── components/          # Reusable React components
├── lib/
│   ├── api.ts          # Axios client (baseURL: http://localhost:8000)
│   └── hooks.ts        # Custom hooks for all API calls
├── store/              # Zustand state management
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
├── tailwind.config.ts  # Theme configuration
└── .env.local          # Environment variables
```

## 🔗 API Integration Details

### Configured Endpoints
```typescript
POST   /ai/cluster           → ClusterResult
POST   /ai/optimize          → OptimizationResult  
POST   /ai/trade             → TradeDecision
GET    /emissions/history    → EmissionHistoryResponse
GET    /transactions         → TransactionHistoryResponse
GET    /system/status        → SystemStatus
```

### Request Timeouts
- **Default**: 10 seconds
- **Automatic Retry**: Failed requests show error alert with retry button
- **Deduplication**: Duplicate POST requests prevented

### Error Handling
- Connection errors show `ConnectionError` component
- API errors show `ErrorAlert` with helpful messages
- Retry logic available on all error states

## 🎨 Theme Colors

The frontend uses the GreenProof ClimateTech color scheme:

- **Primary**: `#00FF9C` (Neon Green)  
- **Secondary**: `#0F5132` (Emerald)
- **Background**: `#0B0F14` (Dark Black)
- **Card Background**: `#1a202c` (Dark Blue)

All configured in `tailwind.config.ts`

## 🧪 Testing Checklist

Before deploying to production, verify:

- [ ] Backend running on http://localhost:8000
- [ ] Dashboard loads with no errors
- [ ] Header shows "Backend Online" indicator
- [ ] Analyze page form submits successfully
- [ ] Cluster results display correctly
- [ ] Optimization page shows PPO results (if vector_id available)
- [ ] Trading page shows DQN decisions
- [ ] History page displays emission records
- [ ] All charts render without errors
- [ ] Responsive design works on mobile (<768px)
- [ ] Sidebar collapses on mobile
- [ ] Browser DevTools console has no errors

## 🚢 Production Deployment

### Build for Deployment
```bash
npm run build
```

### Environment Variables (Production)
Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Deploy Anywhere
- **Vercel** (recommended): `npm i -g vercel && vercel`
- **AWS**: Docker + ECS/App Runner
- **GCP**: Cloud Run or App Engine
- **Azure**: Container Instances or App Service
- **Docker**: See README.md for Dockerfile

## 📊 Features Summary

✅ **Real-time Data**
- Live dashboard with KPIs
- Automatic system health polling
- Request deduplication

✅ **Machine Learning Integration**
- Emission clustering (HDBSCAN)
- Anomaly detection with SHAP
- Optimization agent (PPO)
- Trading agent (DQN)

✅ **User Experience**
- Glassmorphism design
- Smooth animations
- Loading states
- Error handling
- Fully responsive

✅ **Developer Experience**
- Full TypeScript type safety
- Custom hooks for all APIs
- Zustand state with persistence
- Reusable components

## 🆘 Troubleshooting

### "Backend Offline" message won't disappear
**Solution**: Check if backend is running:
```bash
ps aux | grep uvicorn
# or on Windows:
tasklist | grep python
```

### Port 3000 already in use
**Solution**: Kill the process or use different port:
```bash
npm run dev -- -p 3001
```

### TypeScript errors during development
**Solution**: Check strict null checks - ensure API responses are handled:
```tsx
if (data) {
  // Use data
}
```

### Styling looks broken
**Solution**: Tailwind CSS cached issue:
```bash
rm -rf .next
npm run dev
```

## 📚 Documentation

- **Full README**: `frontend/README.md` - Comprehensive guide
- **API Docs**: Backend FastAPI `/docs` (http://localhost:8000/docs)
- **Component Storybook**: Coming soon

## 💬 Questions?

1. Check the full [README.md](./README.md)
2. Review component code in `components/`
3. Check `lib/hooks.ts` for API integration examples
4. Review `store/` directory for state management

## 🎯 Next: Connect to Backend

**The frontend is ready.** Now start your FastAPI backend:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Then visit: **http://localhost:3000**

---

**Built with ❤️ for carbon intelligence. GreenProof 2026.**
