'use client';

import { useEffect, useState } from 'react';
import { useFetchEmissionHistory, useFetchTransactions } from '@/lib/hooks';
import { EmissionHistoryResponse, TransactionHistoryResponse } from '@/types';
import { EmissionTrendChart, ClusterDistributionChart, TransactionVolumeChart } from '@/components/charts/Charts';
import { LoadingShimmer } from '@/components/loaders/Loaders';
import { ConnectionError, EmptyState } from '@/components/cards/ErrorCards';
import { TrendingDown, BarChart3, DollarSign, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { fetch: fetchHistory, isLoading: historyLoading, error: historyError } = useFetchEmissionHistory();
  const { fetch: fetchTxns, isLoading: txLoading, error: txError } = useFetchTransactions();

  const [emissionHistory, setEmissionHistory] = useState<EmissionHistoryResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Real-time states injected by WebSocket
  const [realtimeVolume, setRealtimeVolume] = useState<number>(0);
  const [realtimeEmissions, setRealtimeEmissions] = useState<number>(0);
  const [realtimeEmissionChange, setRealtimeEmissionChange] = useState<number>(-12.5);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [historyData, txData] = await Promise.all([fetchHistory(), fetchTxns()]);
        setEmissionHistory(historyData);
        setTransactions(txData);
        setRealtimeEmissions(historyData.total_emissions);
        setRealtimeVolume(txData.total_volume);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your backend connection.');
      }
    };

    loadData();
  }, [fetchHistory, fetchTxns]);

  // Establish Real-Time WebSocket Connection
  useEffect(() => {
    let wsUrl = 'ws://localhost:8000/ws';
    if (process.env.NEXT_PUBLIC_API_URL) {
      wsUrl = process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws') + '/ws';
    }
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Real-time Connection Established');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'DASHBOARD_LIVE_STREAM') {
          // Update numbers dynamically as if AI model is processing trades in real-time
          setRealtimeVolume((prev) => prev + data.vol_increment);
          setRealtimeEmissions((prev) => Math.max(0, prev + data.emission_fluctuation));
          setRealtimeEmissionChange((prev) => {
             const change = prev + (data.emission_fluctuation * 0.1);
             return Number(change.toFixed(2));
          });
        }
      } catch (err) {
        console.error('WebSocket parse error', err);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const isLoading = historyLoading || txLoading;
  const hasError = historyError || txError || error;

  if (hasError) {
    return (
      <div className="p-8">
        <ConnectionError
          onRetry={() => {
            setError(null);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  if (isLoading || !emissionHistory || !transactions) {
    return (
      <div className="p-8 relative">
        <div className="mb-8 relative z-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-2 font-medium">Welcome back to your carbon intelligence platform</p>
        </div>
        <LoadingShimmer />
      </div>
    );
  }

  const buyCount = transactions.transactions.filter((t) => t.type === 'BUY').length;
  const sellCount = transactions.transactions.filter((t) => t.type === 'SELL').length;

  return (
    <div className="p-8 space-y-8 relative z-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Dashboard</h1>
          <p className="text-emerald-400/80 mt-1 font-medium tracking-wide">Monitor emissions, optimize and trade carbon credits</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
            + Add Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Emissions"
          value={`${realtimeEmissions.toFixed(2)} kg`}
          change={realtimeEmissionChange}
          icon={<TrendingDown size={24} />}
          color="bg-red-50"
          iconColor="text-red-600"
          changeColor="text-red-600"
          isLive={wsConnected}
        />
        <KPICard
          title="Clusters Analyzed"
          value={emissionHistory.items.length.toString()}
          change={8.2}
          icon={<BarChart3 size={24} />}
          color="bg-blue-50"
          iconColor="text-blue-600"
          changeColor="text-blue-600"
          isLive={false}
        />
        <KPICard
          title="Active Trades"
          value={(buyCount + sellCount).toString()}
          change={3.1}
          icon={<Zap size={24} />}
          color="bg-yellow-50"
          iconColor="text-yellow-600"
          changeColor="text-yellow-600"
          isLive={wsConnected}
        />
        <KPICard
          title="Trading Volume"
          value={`$${realtimeVolume.toFixed(2)}`}
          change={15.3}
          icon={<DollarSign size={24} />}
          color="bg-emerald-50"
          iconColor="text-emerald-600"
          changeColor="text-emerald-600"
          isLive={wsConnected}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/20 transition-all duration-700" />
          <h3 className="text-lg font-bold text-white mb-6 tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Emission Trends</h3>
          <EmissionTrendChart data={emissionHistory.items} />
        </div>
        <div className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-700" />
          <h3 className="text-lg font-bold text-white mb-6 tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Cluster Distribution</h3>
          <ClusterDistributionChart data={emissionHistory.items} />
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-all duration-700" />
        <h3 className="text-lg font-bold text-white mb-6 tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Trading Activity</h3>
        <TransactionVolumeChart buyCount={buyCount} sellCount={sellCount} totalVolume={realtimeVolume} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Analyze Emissions"
          description="Submit and analyze new emission data"
          icon="📊"
          href="/analyze"
          color="bg-blue-500"
        />
        <QuickActionCard
          title="Optimize Strategy"
          description="Get AI-powered carbon reduction recommendations"
          icon="🎯"
          href="/optimization"
          color="bg-emerald-500"
        />
        <QuickActionCard
          title="Trade Credits"
          description="Execute carbon credit trades"
          icon="💱"
          href="/trading"
          color="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        />
      </div>
    </div>
  );
}

function KPICard({ title, value, change, icon, color, iconColor, changeColor, isLive }: any) {
  // Update colors to work better in dark mode
  const bgColors: any = {
    'bg-red-50': 'bg-red-500/10 border-red-500/20',
    'bg-blue-50': 'bg-blue-500/10 border-blue-500/20',
    'bg-yellow-50': 'bg-yellow-500/10 border-yellow-500/20',
    'bg-emerald-50': 'bg-emerald-500/10 border-emerald-500/20',
  };
  const iconBaseColors: any = {
    'text-red-600': 'text-red-400',
    'text-blue-600': 'text-blue-400',
    'text-yellow-600': 'text-yellow-400',
    'text-emerald-600': 'text-emerald-400',
  };

  const currentBg = bgColors[color] || 'bg-white/5 border-white/10';
  const currentIconColor = iconBaseColors[iconColor] || iconColor;
  const currentChangeColor = iconBaseColors[changeColor] || changeColor;

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-white/20 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-xl border ${currentBg} transition-transform group-hover:scale-110 duration-300 shadow-inner relative`}>
          {isLive && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping z-10" />}
          {isLive && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full z-10" />}
          <div className={currentIconColor}>{icon}</div>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-bold ${currentChangeColor} bg-white/5 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5`}>
          {change >= 0 ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <p className="text-gray-400 text-sm font-medium tracking-wide">{title}</p>
      <p className={`text-3xl font-black mt-2 tracking-tight ${currentIconColor === 'text-emerald-400' ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-white'} ${isLive ? 'animate-pulse duration-[3000ms]' : ''}`}>{value}</p>
    </div>
  );
}

function QuickActionCard({ title, description, icon, href, color }: any) {
  // Override color mapping for dark mode glow
  const darkColor = color.includes('blue') ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
    color.includes('emerald') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
      color.includes('yellow') ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : color;

  const shadowColor = color.includes('blue') ? 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]' :
    color.includes('emerald') ? 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' :
      color.includes('yellow') ? 'hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]' : '';

  return (
    <Link href={href}>
      <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:-translate-y-1 hover:border-white/30 transition-all duration-300 cursor-pointer group ${shadowColor} relative overflow-hidden`}>
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 ${darkColor} shadow-inner relative z-10`}>
          {icon}
        </div>
        <h3 className="font-bold text-white mt-5 tracking-wide text-lg relative z-10">{title}</h3>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed relative z-10">{description}</p>
        <div className="flex items-center gap-2 text-emerald-400 mt-5 font-bold text-sm uppercase tracking-wider relative z-10">
          Get Started <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );
}
