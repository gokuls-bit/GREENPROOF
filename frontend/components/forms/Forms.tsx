'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/loaders/Loaders';
import { AlertCircle, Send } from 'lucide-react';

interface AnalyzeFormProps {
  onSubmit: (description: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function AnalyzeForm({ onSubmit, isLoading = false, error }: AnalyzeFormProps) {
  const [description, setDescription] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    setCharCount(text.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      await onSubmit(description);
      setDescription('');
      setCharCount(0);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze Emissions</h2>
      <p className="text-gray-600 mb-6">Describe your emission event and get AI-powered analysis</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Emission Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleChange}
            placeholder="E.g., Manufacturing facility produced CO2 emissions from production line A on February 26..."
            disabled={isLoading}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 resize-none"
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-gray-500">{charCount} characters</span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !description.trim()}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Analyzing...
            </>
          ) : (
            <>
              <Send size={18} />
              Analyze Emission
            </>
          )}
        </button>
      </form>
    </div>
  );
}

interface OptimizeFormProps {
  onSubmit: (vectorId: string, targetReduction?: number) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  vectorId?: string | null;
}

export function OptimizeForm({
  onSubmit,
  isLoading = false,
  error,
  vectorId,
}: OptimizeFormProps) {
  const [targetReduction, setTargetReduction] = useState(20);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vectorId) {
      await onSubmit(vectorId, targetReduction / 100);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Optimization Strategy</h2>
      <p className="text-gray-600 mb-6">Set your target reduction goal for carbon emissions</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!vectorId && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-blue-800">Analyze an emission first to get optimization recommendations</span>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="targetReduction" className="block text-sm font-semibold text-gray-900">
              Target Reduction
            </label>
            <span className="text-2xl font-bold text-emerald-600">{targetReduction}%</span>
          </div>
          <input
            id="targetReduction"
            type="range"
            min="0"
            max="100"
            value={targetReduction}
            onChange={(e) => setTargetReduction(Number(e.target.value))}
            disabled={isLoading || !vectorId}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2">
            Adjust the slider to set your emissions reduction target
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !vectorId}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Optimizing...
            </>
          ) : (
            <>
              <Send size={18} />
              Run Optimization
            </>
          )}
        </button>
      </form>
    </div>
  );
}

interface TradeFormProps {
  onSubmit: (balance: number, marketState: Record<string, number>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function TradeForm({ onSubmit, isLoading = false, error }: TradeFormProps) {
  const [balance, setBalance] = useState(10000);
  const [carbonPrice, setCarbonPrice] = useState(25.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const marketState = {
      carbon_price: carbonPrice,
      market_volatility: Math.random() * 0.5,
      demand_level: Math.random(),
    };
    await onSubmit(balance, marketState);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Execute Trade</h2>
      <p className="text-gray-600 mb-6">Make informed decisions with AI-powered trading recommendations</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="balance" className="block text-sm font-semibold text-gray-900 mb-2">
              Portfolio Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
              <input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="carbonPrice" className="block text-sm font-semibold text-gray-900 mb-2">
              Carbon Price per Credit
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
              <input
                id="carbonPrice"
                type="number"
                value={carbonPrice}
                onChange={(e) => setCarbonPrice(Number(e.target.value))}
                disabled={isLoading}
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Processing Trade...
            </>
          ) : (
            <>
              <Send size={18} />
              Execute Trade
            </>
          )}
        </button>
      </form>
    </div>
  );
}
