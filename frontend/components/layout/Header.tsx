'use client';

import { useSystemHealth } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { Leaf, AlertCircle, Settings, Bell } from 'lucide-react';
import { SystemStatus } from '@/types';

export default function Header() {
  const { check } = useSystemHealth();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const result = await check();
      setStatus(result);
      setLoading(false);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, [check]);

  if (loading) {
    return (
      <header className="sticky top-0 z-20 bg-gray-900/50 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="px-4 py-4 md:px-8 flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  const isHealthy = status?.backend_online && status?.ml_models_loaded;

  return (
    <header className="sticky top-0 z-20 bg-gray-900/40 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300">
      <div className="px-4 py-3 md:px-8 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-100">Dashboard</h1>
            <span className="text-xs text-gray-400 px-2 py-1 bg-white/5 rounded backdrop-blur-sm border border-white/10">Pro</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors
              ${isHealthy
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-sm'
                : 'border-red-500/30 bg-red-500/10 text-red-400 backdrop-blur-sm'
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`}></span>
            <span>{isHealthy ? 'System Online' : 'System Offline'}</span>
          </div>

          {/* Action Icons */}
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Notifications">
            <Bell size={20} className="text-gray-400 hover:text-white transition-colors" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Settings">
            <Settings size={20} className="text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
