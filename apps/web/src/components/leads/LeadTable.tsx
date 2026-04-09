'use client';

import { Lead } from '@/types/lead';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LeadScoreBadge } from './LeadScoreBadge';
import { formatDate } from '@/lib/utils';

interface LeadTableProps {
  leads: Lead[];
  onRowClick?: (lead: Lead) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  unqualified: 'neutral',
  converted: 'success',
  lost: 'danger',
};

export function LeadTable({ leads, onRowClick, sortKey, sortDir, onSort }: LeadTableProps) {
  const columns = [
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      render: (_: unknown, row: Lead) => (
        <div>
          <div className="font-medium text-slate-900">{row.firstName} {row.lastName}</div>
          {row.email && <div className="text-xs text-slate-500">{row.email}</div>}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (v: unknown) => v ? String(v) : <span className="text-slate-400">—</span>,
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (v: unknown) => (
        <span className="capitalize text-slate-600">{String(v).replace('_', ' ')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v: unknown) => (
        <Badge variant={statusVariant[String(v)] || 'neutral'} className="capitalize">
          {String(v)}
        </Badge>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      render: (v: unknown) => <LeadScoreBadge score={Number(v)} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (v: unknown) => <span className="text-slate-500">{formatDate(String(v))}</span>,
    },
  ];

  return (
    <Table
      columns={columns}
      data={leads}
      onRowClick={onRowClick}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={onSort}
    />
  );
}
