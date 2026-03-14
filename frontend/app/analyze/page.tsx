'use client';

import { useAnalyzeEmission } from '@/lib/hooks';
import { useEmissionStore } from '@/store/emissionStore';
import { AnalyzeForm } from '@/components/forms/Forms';
import { ClusterResultCard } from '@/components/cards/ResultCards';
import { ErrorAlert } from '@/components/cards/ErrorCards';
import { LoadingSpinner } from '@/components/loaders/Loaders';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default function AnalyzePage() {
  const { analyze, isLoading } = useAnalyzeEmission();
  const { error, setError, currentEmission, setCurrentEmission, clusterResult } = useEmissionStore();
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleAnalyze = async (description: string) => {
    setCurrentEmission(description);
    setErrorState(null);
    try {
      await analyze({ description });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze emission';
      setErrorState(errorMsg);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Leaf className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Emission Analysis</h1>
        </div>
        <p className="text-gray-600">Submit emission data and get AI-powered classification and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="space-y-6">
          <AnalyzeForm
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            error={errorState || error}
          />

          {isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin">
                <LoadingSpinner size="lg" />
              </div>
              <p className="text-gray-700 text-center font-medium">
                Analyzing with AI models...
              </p>
              <p className="text-xs text-gray-500 text-center">
                Running clustering, anomaly detection & explainability
              </p>
            </div>
          )}

          {clusterResult && (
            <div className="pt-4">
              <Link href="/optimization" className="block">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-between px-6">
                  <span>View Optimization Strategies</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Result Column */}
        <div className="space-y-6">
          {clusterResult && (
            <>
              <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-6">
                <p className="text-sm font-semibold text-gray-900 mb-2">Analyzed Description</p>
                <p className="text-gray-700">{currentEmission}</p>
              </div>

              <ClusterResultCard data={clusterResult} />

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Cluster Type</p>
                  <p className="font-bold text-lg text-emerald-600">{clusterResult.cluster_label}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Confidence</p>
                  <p className="font-bold text-lg text-blue-600">
                    {(clusterResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </>
          )}

          {!clusterResult && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-5xl">📊</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-sm text-gray-600">
                  Submit an emission description on the left to see analysis results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
        <h3 className="font-semibold text-gray-900 text-lg">How Analysis Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-2xl">🔍</div>
            <h4 className="font-semibold text-gray-900">Clustering</h4>
            <p className="text-sm text-gray-600">
              Groups similar emissions into patterns using ML algorithms
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">⚠️</div>
            <h4 className="font-semibold text-gray-900">Anomaly Detection</h4>
            <p className="text-sm text-gray-600">
              Identifies unusual emission patterns that need attention
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">📈</div>
            <h4 className="font-semibold text-gray-900">Explainability</h4>
            <p className="text-sm text-gray-600">
              Provides clear reasons why emissions were classified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
