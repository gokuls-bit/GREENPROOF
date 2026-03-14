'use client';

import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export function ErrorAlert({
  title,
  message,
  onRetry,
  onDismiss,
  type = 'error',
}: ErrorAlertProps) {
  const typeClasses = {
    error: 'border-red-500/30 bg-red-900/20 text-red-200 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]',
    warning: 'border-amber-500/30 bg-amber-900/20 text-amber-200 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]',
    info: 'border-blue-500/30 bg-blue-900/20 text-blue-200 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]',
  };

  return (
    <div className={`rounded-lg p-4 border ${typeClasses[type]} animate-fade-in`}>
      <div className="flex items-start gap-4">
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-2 hover:bg-white/50 rounded transition-colors"
              title="Retry"
            >
              <RefreshCw size={16} />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white/50 rounded transition-colors"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ConnectionErrorProps {
  onRetry?: () => void;
}

export function ConnectionError({ onRetry }: ConnectionErrorProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 text-center space-y-4 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl -z-10" />
      <div className="flex justify-center">
        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
          <AlertCircle size={48} className="text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-red-100 mb-2 tracking-wide">Connection Error</h2>
        <p className="text-red-200/80 mb-4 font-medium">
          Unable to connect to the backend server. Please ensure the FastAPI server is running at{' '}
          <code className="bg-red-500/20 border border-red-500/30 px-2 py-1 rounded-md text-red-300 font-mono text-sm ml-1">
            http://localhost:8000
          </code>
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-red-600/80 text-white rounded-xl font-bold tracking-wide hover:bg-red-500 transition-all inline-flex items-center gap-2 border border-red-400/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] backdrop-blur-md"
        >
          <RefreshCw size={16} />
          Retry Connection
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="flex justify-center">
        <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] glow-green">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{title}</h3>
        <p className="text-gray-400 mb-4 leading-relaxed">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold tracking-wide hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-400/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
