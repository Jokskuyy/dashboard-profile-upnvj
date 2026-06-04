import React from "react";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "green" | "gold" | "slate" | "teal" | "brown";
  onClick?: () => void;
}

const colorClasses = {
  green: {
    bg: "bg-[#E8F0E8]",
    icon: "text-[#2C5F2D]",
    border: "border-[#2C5F2D]/20",
    iconBg: "bg-[#2C5F2D]/10",
  },
  gold: {
    bg: "bg-amber-50",
    icon: "text-[#B8860B]",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "text-slate-700",
    border: "border-slate-200",
    iconBg: "bg-slate-100",
  },
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-700",
    border: "border-teal-200",
    iconBg: "bg-teal-100",
  },
  brown: {
    bg: "bg-orange-50",
    icon: "text-orange-800",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  onClick,
}) => {
  const c = colorClasses[color];
  const isZero = value === 0 || value === "0";

  return (
    <div
      className={`
        ${c.bg} ${c.border} border rounded-xl p-4 sm:p-5 md:p-6 
        transition-all duration-200
        ${onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            {title}
          </p>
          <p className={`text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 ${
            isZero ? "text-gray-300" : "text-gray-900"
          }`}>
            {isZero ? "—" : value}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-xl ${c.iconBg} shrink-0`}>
          <Icon
            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${c.icon}`}
          />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
