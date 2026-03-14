'use client';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex-center`}>
      <div
        className={`
          rounded-full border-border-color border-t-primary-green 
          animate-spin ${sizeClasses[size]}
        `}
      />
    </div>
  );
}

export function LoadingShimmer() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-card-bg rounded-lg shimmer"
        />
      ))}
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex-center gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-primary-green rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="glass-card p-6 space-y-4"
        >
          <div className="h-4 bg-card-bg rounded animate-pulse"></div>
          <div className="h-4 bg-card-bg rounded animate-pulse w-3/4"></div>
          <div className="h-20 bg-card-bg rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
