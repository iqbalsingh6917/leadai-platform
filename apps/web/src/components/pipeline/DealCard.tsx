'use client';

import { Deal } from '@/types/pipeline';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calendar, DollarSign } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onClick?: () => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
    >
      <h4 className="text-sm font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 line-clamp-2">
        {deal.title}
      </h4>
      <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium mb-1">
        <DollarSign className="w-3.5 h-3.5" />
        {formatCurrency(deal.value)}
      </div>
      {deal.contactName && (
        <p className="text-xs text-slate-500 mb-1">{deal.contactName}</p>
      )}
      {deal.expectedCloseDate && (
        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
          <Calendar className="w-3 h-3" />
          <span>Close: {formatDate(deal.expectedCloseDate)}</span>
        </div>
      )}
    </div>
  );
}
