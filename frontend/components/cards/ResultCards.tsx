'use client';

import { formatNumber, formatPercentage, formatCO2, getConfidenceColor } from '@/utils/helpers';
import { ClusterResult, OptimizationResult, TradeDecision } from '@/types';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface ClusterResultCardProps {
  data: ClusterResult;
}

export function ClusterResultCard({ data }: ClusterResultCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Cluster Label</p>
          <p className="text-2xl font-bold text-emerald-600">{data.cluster_label}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${data.confidence * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {formatPercentage(data.confidence)}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-emerald-600 text-xs font-semibold mb-2 uppercase">CO₂ Estimate</p>
          <p className="text-xl font-bold text-emerald-700">{formatCO2(data.co2_estimate)}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-xs font-semibold mb-2 uppercase">Anomaly Score</p>
          <p className="text-xl font-bold text-blue-700">
            {formatNumber(data.anomaly_score, 3)}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-xs font-semibold mb-2 uppercase">SHAP Explanation</p>
        <p className="text-sm text-gray-700 leading-relaxed">{data.shap_summary}</p>
      </div>

      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span>Vector ID:</span>
        <code className="bg-gray-100 px-2 py-1 rounded font-mono">{data.vector_id.substring(0, 16)}...</code>
      </div>
    </div>
  );
}

interface OptimizationResultCardProps {
  data: OptimizationResult;
}

export function OptimizationResultCard({ data }: OptimizationResultCardProps) {
  const isPositiveReduction = data.expected_reduction > 0;
  const TrendIcon = isPositiveReduction ? TrendingDown : TrendingUp;
  const trendColor = isPositiveReduction ? 'text-emerald-600' : 'text-amber-600';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Recommended Strategy</p>
          <h3 className="text-2xl font-bold text-emerald-600">{data.strategy}</h3>
        </div>
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Zap className="text-emerald-600" size={24} />
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-emerald-600 text-xs font-semibold mb-2 uppercase">Expected Reduction</p>
          <div className="flex items-center gap-2">
            <TrendIcon size={20} className={trendColor} />
            <p className={`text-xl font-bold ${trendColor}`}>
              {formatPercentage(data.expected_reduction)}
            </p>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-xs font-semibold mb-2 uppercase">Reward Score</p>
          <p className="text-xl font-bold text-blue-700">{formatNumber(data.reward_score, 2)}</p>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-600 text-xs font-semibold mb-2 uppercase">Cost Impact</p>
        <p className="text-lg font-bold text-yellow-700">
          ${Math.abs(data.cost_impact).toFixed(2)}{' '}
          <span className={data.cost_impact > 0 ? 'text-red-600' : 'text-emerald-600'}>
            {data.cost_impact > 0 ? 'Cost' : 'Savings'}
          </span>
        </p>
      </div>

      <div>
        <p className="text-gray-600 text-xs font-semibold mb-2 uppercase">Confidence</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${data.confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-emerald-600">{formatPercentage(data.confidence)}</span>
        </div>
      </div>
    </div>
  );
}

interface TradeDecisionCardProps {
  data: TradeDecision;
}

export function TradeDecisionCard({ data }: TradeDecisionCardProps) {
  const actionColors = {
    BUY: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    SELL: 'bg-red-100 text-red-700 border-red-300',
    HOLD: 'bg-amber-100 text-amber-700 border-amber-300',
  };

  const riskColors = {
    LOW: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-300',
    HIGH: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Trade Action</p>
          <div className={`inline-block px-4 py-2 rounded-lg border font-bold ${actionColors[data.action]}`}>
            {data.action}
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-xs font-semibold mb-2 uppercase">Risk Level</p>
          <div className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${
            riskColors[data.risk_level]
          }`}>
            {data.risk_level}
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-emerald-600 text-xs font-semibold mb-2 uppercase">Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${data.confidence * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-emerald-600">{formatPercentage(data.confidence)}</span>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${data.projected_profit > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs font-semibold mb-2 uppercase ${data.projected_profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>Projected Profit</p>
          <p className={`text-xl font-bold ${data.projected_profit > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            ${data.projected_profit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-xs font-semibold mb-2 uppercase">Reasoning</p>
        <p className="text-sm text-gray-700 leading-relaxed">{data.reasoning}</p>
      </div>
    </div>
  );
}
