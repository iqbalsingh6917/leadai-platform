'use client';

import { Contact } from '@/types/contact';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface ContactTableProps {
  contacts: Contact[];
  onRowClick?: (contact: Contact) => void;
}

const lifecycleVariant: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  customer: 'success',
  opportunity: 'warning',
  sales_qualified_lead: 'info',
  marketing_qualified_lead: 'info',
  lead: 'neutral',
  subscriber: 'neutral',
};

export function ContactTable({ contacts, onRowClick }: ContactTableProps) {
  const columns = [
    {
      key: 'firstName',
      header: 'Name',
      render: (_: unknown, row: Contact) => (
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
      key: 'company',
      header: 'Company',
      render: (v: unknown) => v ? String(v) : <span className="text-slate-400">—</span>,
    },
    {
      key: 'lifecycleStage',
      header: 'Lifecycle Stage',
      render: (v: unknown) => (
        <Badge variant={lifecycleVariant[String(v)] || 'neutral'}>
          {String(v).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (v: unknown) => <span className="text-slate-500">{formatDate(String(v))}</span>,
    },
  ];

  return (
    <Table
      columns={columns}
      data={contacts}
      onRowClick={onRowClick}
    />
  );
}
