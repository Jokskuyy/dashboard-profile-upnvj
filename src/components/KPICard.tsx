import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-200'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-200'
  }
};

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  onClick 
}) => {
  const colorClass = colorClasses[color];

  return (
    <div 
      className={`
        ${colorClass.bg} ${colorClass.border} border rounded-lg p-6 
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClass.bg}`}>
          <Icon className={`w-8 h-8 ${colorClass.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
