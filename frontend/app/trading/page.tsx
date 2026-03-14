'use client';

import { useTrade } from '@/lib/hooks';
import { useTradingStore } from '@/store/tradingStore';
import { TradeForm } from '@/components/forms/Forms';
import { TradeDecisionCard } from '@/components/cards/ResultCards';
import { ConfidenceMetres } from '@/components/charts/Charts';
import { LoadingSpinner } from '@/components/loaders/Loaders';
import { EmptyState, ErrorAlert } from '@/components/cards/ErrorCards';
import { useState } from 'react';
import { TrendingDown, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function TradingPage() {
  const { trade, isLoading } = useTrade();
  const { error, action, confidence, projectedProfit, tradeHistory } = useTradingStore();
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleTrade = async (balance: number, marketState: Record<string, number>) => {
    setErrorState(null);
    try {
      await trade({ balance, marketState });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to execute trade';
      setErrorState(errorMsg);
    }
  };

  // Generate chart data for profit projection
  const projectionData = Array.from({ length: 10 }, (_, i) => ({
    day: i + 1,
    profit: (projectedProfit || 0) * (i + 1) * 0.1,
  }));

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Carbon Trading</h1>
        </div>
        <p className="text-gray-600">AI-powered trading decisions for carbon credit markets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="space-y-6">
          <TradeForm onSubmit={handleTrade} isLoading={isLoading} error={errorState || error} />

          {isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin">
                <LoadingSpinner size="lg" />
              </div>
              <p className="text-gray-700 text-center font-medium">
                Analyzing market conditions...
              </p>
              <p className="text-xs text-gray-500 text-center">
                Running DQN trading agent for optimal decision
              </p>
            </div>
          )}
        </div>

        {/* Result Column */}
        <div className="space-y-6">
          {action && (
            <>
              <TradeDecisionCard
                data={{
                  action,
                  confidence: confidence || 0.7,
                  projected_profit: projectedProfit || 0,
                  reasoning: `Based on current market analysis, a ${action} position is recommended.`,
                  risk_level: confidence ? (confidence >= 0.8 ? 'LOW' : confidence >= 0.6 ? 'MEDIUM' : 'HIGH') : 'MEDIUM',
                }}
              />

              {/* Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Trade Analysis</h3>
                <ConfidenceMetres value={confidence || 0.7} label="Decision Confidence" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase">Projected Return</p>
                    <p className={`font-bold text-lg ${projectedProfit && projectedProfit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ${(projectedProfit || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-600 mb-2 uppercase">Action</p>
                    <p className="font-bold text-lg text-blue-600 uppercase">{action}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {!action && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-5xl">📊</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Trade Decision Yet</h3>
                <p className="text-sm text-gray-600">
                  Submit market data to get trading recommendations from the DQN agent
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profit Projection Chart */}
      {action && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Projected Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis stroke="#9ca3af" dataKey="day" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#111827' }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trade History */}
      {tradeHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Recent Trades</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tradeHistory.slice(0, 10).map((trade, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  {trade.action === 'BUY' ? (
                    <TrendingUp className="text-emerald-600" size={18} />
                  ) : trade.action === 'SELL' ? (
                    <TrendingDown className="text-red-600" size={18} />
                  ) : (
                    <DollarSign className="text-blue-600" size={18} />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{trade.action}</p>
                    <p className="text-xs text-gray-500">{(trade.confidence * 100).toFixed(0)}% confidence</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${trade.projected_profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${trade.projected_profit.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Conditions Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="text-emerald-600" size={20} />
            <h3 className="font-semibold text-gray-900">Market Data</h3>
          </div>
          <p className="text-sm text-gray-600">
            Input real-time carbon credit market conditions and pricing
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">DQN Analysis</h3>
          </div>
          <p className="text-sm text-gray-600">
            Deep Q-Network evaluates optimal Buy/Sell/Hold decisions
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={20} />
            <h3 className="font-semibold text-gray-900">Risk Management</h3>
          </div>
          <p className="text-sm text-gray-600">
            Confidence scores reflect market volatility and uncertainty
          </p>
        </div>
      </div>
    </div>
  );
}
