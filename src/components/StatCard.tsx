import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-indigo-50 text-indigo-600',
  iconTextColor = 'text-indigo-600',
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconTextColor}`} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-500 mb-0.5">{title}</h4>
          <div className="text-lg font-bold text-slate-900 leading-tight">{value}</div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
