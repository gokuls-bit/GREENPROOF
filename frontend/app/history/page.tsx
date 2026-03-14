'use client';

import { useFetchEmissionHistory, useFetchTransactions } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { EmissionHistoryResponse, TransactionHistoryResponse } from '@/types';
import { LoadingShimmer } from '@/components/loaders/Loaders';
import { ConnectionError } from '@/components/cards/ErrorCards';
import { formatDate, formatCO2, formatCurrency } from '@/utils/helpers';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

export default function HistoryPage() {
  const { fetch: fetchHistory, isLoading: historyLoading, error: historyError } = useFetchEmissionHistory();
  const { fetch: fetchTxns, isLoading: txLoading, error: txError } = useFetchTransactions();

  const [emissionHistory, setEmissionHistory] = useState<EmissionHistoryResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistoryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'emissions' | 'transactions'>('emissions');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [historyData, txData] = await Promise.all([fetchHistory(), fetchTxns()]);
        setEmissionHistory(historyData);
        setTransactions(txData);
      } catch (err) {
        setError('Failed to load history data');
      }
    };

    loadData();
  }, [fetchHistory, fetchTxns]);

  const isLoading = historyLoading || txLoading;
  const hasError = historyError || txError || error;

  if (hasError) {
    return (
      <div className="p-8">
        <ConnectionError onRetry={() => (window.location.href = '/history')} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <LoadingShimmer />
      </div>
    );
  }

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      emissions: emissionHistory,
      transactions,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greenproof-history-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📋</span>
            <h1 className="text-3xl font-bold text-gray-900">History</h1>
          </div>
          <p className="text-gray-600">View all emissions and trading activity</p>
        </div>
        <button onClick={handleExport} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('emissions')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'emissions'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Emissions ({emissionHistory?.items.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'transactions'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Transactions ({transactions?.transactions.length || 0})
        </button>
      </div>

      {/* Emissions Table */}
      {activeTab === 'emissions' && emissionHistory && (
        <div className="space-y-2">
          {emissionHistory.items.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600">
                <div>Date</div>
                <div>Description</div>
                <div>CO₂ Amount</div>
                <div>Cluster</div>
                <div></div>
              </div>
              <div className="space-y-2">
                {emissionHistory.items.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleRow(item.id)}
                      className="w-full bg-white rounded-lg border border-gray-200 p-4 hover:border-emerald-300 transition-colors"
                    >
                      <div className="hidden md:grid grid-cols-5 gap-4 items-center text-sm">
                        <div className="text-gray-600">{formatDate(item.timestamp)}</div>
                        <div className="text-gray-900 text-left truncate">{item.description.substring(0, 30)}...</div>
                        <div className="text-emerald-600 font-bold">{formatCO2(item.co2_amount)}</div>
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{item.cluster_label}</div>
                        <div className="flex justify-end text-gray-500">
                          {expandedRows.has(item.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                      <div className="md:hidden space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-900">{item.cluster_label}</p>
                          {expandedRows.has(item.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(item.timestamp)}</p>
                      </div>
                    </button>

                    {/* Expanded Row */}
                    {expandedRows.has(item.id) && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-1 space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 mb-1 uppercase">Full Description</p>
                          <p className="text-sm text-gray-700">{item.description}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">CO₂ Amount</p>
                            <p className="font-bold text-emerald-600">{formatCO2(item.co2_amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Vector ID</p>
                            <p className="font-mono text-xs text-gray-600 truncate">{item.vector_id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Timestamp</p>
                            <p className="text-sm text-gray-600">{formatDate(item.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              No emission data available
            </div>
          )}
        </div>
      )}

      {/* Transactions Table */}
      {activeTab === 'transactions' && transactions && (
        <div className="space-y-2">
          {transactions.transactions.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600">
                <div>Date</div>
                <div>Type</div>
                <div>Amount</div>
                <div>Price</div>
                <div>Total</div>
                <div>Status</div>
              </div>
              <div className="space-y-2">
                {transactions.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-emerald-300 transition-colors"
                  >
                    <div className="hidden md:grid grid-cols-6 gap-4 items-center text-sm">
                      <div className="text-gray-600">{formatDate(tx.timestamp)}</div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.type === 'BUY'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </div>
                      <div className="text-gray-900 font-semibold">{tx.amount}</div>
                      <div className="text-gray-600">{formatCurrency(tx.price)}</div>
                      <div className="font-semibold text-gray-900">{formatCurrency(tx.total)}</div>
                      <div>
                        <span
                          className={`text-xs font-semibold ${
                            tx.status === 'COMPLETED'
                              ? 'text-emerald-600'
                              : tx.status === 'FAILED'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                    <div className="md:hidden space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.type === 'BUY'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="font-semibold text-gray-900">{formatCurrency(tx.total)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              No transaction data available
            </div>
          )}
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Total Emissions</p>
          <p className="text-3xl font-bold text-emerald-600">
            {formatCO2(emissionHistory?.total_emissions || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Total Volume</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(transactions?.total_volume || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase">Total Trades</p>
          <p className="text-3xl font-bold text-yellow-600">
            {transactions?.total_trades || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
