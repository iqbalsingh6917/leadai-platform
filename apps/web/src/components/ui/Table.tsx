'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  className?: string;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
  className,
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider',
                  col.sortable ? 'cursor-pointer select-none hover:bg-slate-100' : ''
                )}
                onClick={() => col.sortable && onSort && onSort(String(col.key))}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="flex flex-col">
                      <ChevronUp
                        className={cn(
                          'w-3 h-3',
                          sortKey === col.key && sortDir === 'asc' ? 'text-indigo-600' : 'text-slate-300'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 -mt-1',
                          sortKey === col.key && sortDir === 'desc' ? 'text-indigo-600' : 'text-slate-300'
                        )}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {data.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'transition-colors duration-100',
                onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                  {col.render
                    ? col.render((row as Record<string, unknown>)[String(col.key)], row)
                    : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
