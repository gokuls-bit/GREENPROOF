'use client';

import { useOptimizeEmission } from '@/lib/hooks';
import { useEmissionStore } from '@/store/emissionStore';
import { useOptimizationStore } from '@/store/optimizationStore';
import { OptimizeForm } from '@/components/forms/Forms';
import { OptimizationResultCard } from '@/components/cards/ResultCards';
import { ConfidenceMetres } from '@/components/charts/Charts';
import { LoadingSpinner } from '@/components/loaders/Loaders';
import { EmptyState, ErrorAlert } from '@/components/cards/ErrorCards';
import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Target, DollarSign, AlertCircle } from 'lucide-react';

export default function OptimizationPage() {
  const { optimize, isLoading } = useOptimizeEmission();
  const { vectorId } = useEmissionStore();
  const { error, strategy, rewardScore, expectedReduction, confidence } = useOptimizationStore();
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleOptimize = async (vId: string, targetReduction?: number) => {
    setErrorState(null);
    try {
      await optimize({ vectorId: vId, targetReduction });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to optimize';
      setErrorState(errorMsg);
    }
  };

  if (!vectorId) {
    return (
      <div className="p-8">
        <EmptyState
          icon={<TrendingUp size={48} />}
          title="No Emission Analyzed"
          description="You need to analyze an emission first before optimizing"
          action={{
            label: 'Analyze Emission',
            onClick: () => (window.location.href = '/analyze'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Optimization Strategy</h1>
        </div>
        <p className="text-gray-600">AI-powered recommendations for maximum emission reduction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="space-y-6">
          <OptimizeForm
            onSubmit={handleOptimize}
            isLoading={isLoading}
            error={errorState || error}
            vectorId={vectorId}
          />

          {isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin">
                <LoadingSpinner size="lg" />
              </div>
              <p className="text-gray-700 text-center font-medium">
                Optimizing strategy...
              </p>
              <p className="text-xs text-gray-500 text-center">
                Running reinforcement learning model for best strategies
              </p>
            </div>
          )}

          {strategy && confidence && (
            <div className="pt-4">
              <Link href="/trading" className="block">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-between px-6">
                  <span>Execute Trading Strategy</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Result Column */}
        <div className="space-y-6">
          {strategy && (
            <>
              <OptimizationResultCard
                data={{
                  strategy,
                  expected_reduction: expectedReduction || 0.2,
                  reward_score: rewardScore || 0,
                  cost_impact: 0,
                  confidence: confidence || 0.8,
                }}
              />

              {/* Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
                <ConfidenceMetres value={confidence || 0.8} label="Model Confidence" />
                <ConfidenceMetres
                  value={Math.min((expectedReduction || 0.2) / 0.5, 1)}
                  label="Reduction Potential"
                />
                <ConfidenceMetres
                  value={rewardScore ? Math.min(rewardScore / 100, 1) : 0}
                  label="Reward Score"
                />
              </div>

              {/* Recommendation */}
              <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-6">
                <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase">Recommended Strategy</p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Implement the <span className="font-semibold text-emerald-700">{strategy}</span> strategy
                  to achieve up to{' '}
                  <span className="font-semibold text-emerald-700">
                    {(expectedReduction ? expectedReduction * 100 : 20).toFixed(0)}%
                  </span>{' '}
                  reduction in carbon emissions.
                </p>
              </div>
            </>
          )}

          {!strategy && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-5xl">📈</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Optimization Yet</h3>
                <p className="text-sm text-gray-600">
                  Run the optimization to see AI-powered reduction strategies
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="text-emerald-600" size={20} />
            <h3 className="font-semibold text-gray-900">Reduction Strategy</h3>
          </div>
          <p className="text-sm text-gray-600">
            Get evidence-based strategies to reduce your carbon footprint
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">Cost Analysis</h3>
          </div>
          <p className="text-sm text-gray-600">
            Understand the financial impact of reduction strategies
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-amber-600" size={20} />
            <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
          </div>
          <p className="text-sm text-gray-600">
            Evaluate implementation risks and viability of strategies
          </p>
        </div>
      </div>
    </div>
  );
}
