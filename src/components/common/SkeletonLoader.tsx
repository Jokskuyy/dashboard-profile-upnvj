import React from "react";

// Base skeleton component
export const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "", style }) => (
  <div
    className={`animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-[200%_100%] rounded ${className}`}
    style={{
      animation: "shimmer 2s infinite linear",
      ...style,
    }}
  />
);

// KPI Card Skeleton
export const KPICardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="w-12 h-12 rounded-lg" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Card Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
    <Skeleton className="h-6 w-40 mb-4" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
    <Skeleton className="h-6 w-48 mb-6" />
    <div className="space-y-4">
      {[80, 60, 90, 70, 85].map((height, i) => (
        <div key={i} className="flex items-end gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton style={{ height: `${height}px` }} className="flex-1" />
        </div>
      ))}
    </div>
  </div>
);


// Accreditation Row Skeleton
export const AccreditationRowSkeleton: React.FC = () => (
  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

// Section Skeleton (for dashboard sections)
export const SectionSkeleton: React.FC<{ title?: boolean; items?: number }> = ({ 
  title = true, 
  items = 3 
}) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
    {title && (
      <div className="mb-6">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    )}
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// Dashboard Grid Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <SectionSkeleton items={4} />
      <SectionSkeleton items={4} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <SectionSkeleton items={3} />
      <ChartSkeleton />
    </div>
  </div>
);

// Add keyframes for shimmer animation
const style = document.createElement("style");
style.innerHTML = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);
