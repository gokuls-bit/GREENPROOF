'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { EmissionHistoryItem } from '@/types';

const COLORS = ['#00FF9C', '#0F5132', '#00D9FF', '#FFD700', '#FF6B6B'];

interface EmissionTrendChartProps {
  data: EmissionHistoryItem[];
}

export function EmissionTrendChart({ data }: EmissionTrendChartProps) {
  const chartData = data.map((item) => ({
    name: new Date(item.timestamp).toLocaleDateString(),
    co2: item.co2_amount,
  }));

  return (
    <div className="bg-transparent w-full h-full p-2">
      <h3 className="text-lg font-bold mb-4 tracking-wide text-white opacity-0 absolute pointer-events-none">Emission Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00FF9C" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
          <XAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827E6',
              backdropFilter: 'blur(12px)',
              border: '1px solid #ffffff1a',
              borderRadius: '12px',
              color: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: '#00FF9C', fontWeight: 'bold' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="co2"
            stroke="#00FF9C"
            fillOpacity={1}
            fill="url(#colorCo2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ClusterDistributionChartProps {
  data: EmissionHistoryItem[];
}

export function ClusterDistributionChart({ data }: ClusterDistributionChartProps) {
  const clusterCounts = data.reduce(
    (acc, item) => {
      const existing = acc.find((c) => c.name === item.cluster_label);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: item.cluster_label, value: 1 });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  return (
    <div className="bg-transparent w-full h-full p-2">
      <h3 className="text-lg font-bold mb-4 tracking-wide text-white opacity-0 absolute pointer-events-none">Cluster Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={clusterCounts}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {clusterCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827E6',
              backdropFilter: 'blur(12px)',
              border: '1px solid #ffffff1a',
              borderRadius: '12px',
              color: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            labelStyle={{ display: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {clusterCounts.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm font-medium text-gray-400">
              {item.name}: <span className="text-white font-bold ml-1">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TransactionVolumeChartProps {
  buyCount: number;
  sellCount: number;
  totalVolume: number;
}

export function TransactionVolumeChart({
  buyCount,
  sellCount,
  totalVolume,
}: TransactionVolumeChartProps) {
  const data = [
    { name: 'BUY', value: buyCount, fill: '#00FF9C' },
    { name: 'SELL', value: sellCount, fill: '#FF6B6B' },
  ];

  return (
    <div className="bg-transparent w-full h-full p-2">
      <h3 className="text-lg font-bold mb-4 tracking-wide text-white opacity-0 absolute pointer-events-none">Transaction Summary</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
          <XAxis stroke="#9ca3af" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: '#ffffff0a' }}
            contentStyle={{
              backgroundColor: '#111827E6',
              backdropFilter: 'blur(12px)',
              border: '1px solid #ffffff1a',
              borderRadius: '12px',
              color: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            labelStyle={{ display: 'none' }}
          />
          <Bar dataKey="value" fill="#00FF9C" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
        <div className="text-center rounded-xl bg-white/5 py-3 border border-white/5">
          <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Buy Orders</p>
          <p className="text-2xl font-black text-emerald-400">{buyCount}</p>
        </div>
        <div className="text-center rounded-xl bg-white/5 py-3 border border-white/5">
          <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Sell Orders</p>
          <p className="text-2xl font-black text-red-400">{sellCount}</p>
        </div>
        <div className="text-center rounded-xl bg-white/5 py-3 border border-white/5">
          <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Total Volume</p>
          <p className="text-2xl font-black text-white">${totalVolume}</p>
        </div>
      </div>
    </div>
  );
}

interface ConfidenceMetreProps {
  value: number;
  label?: string;
}

export function ConfidenceMetres({ value, label = 'Confidence' }: ConfidenceMetreProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-primary-green">{(value * 100).toFixed(1)}%</p>
      </div>
      <div className="h-2 bg-card-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-green to-secondary-emerald transition-all duration-500"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
