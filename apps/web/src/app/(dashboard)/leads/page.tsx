'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { BulkImportModal } from '@/components/leads/BulkImportModal';
import { useLeads, useCreateLead } from '@/hooks/useLeads';
import { Lead, CreateLead } from '@/types/lead';
import toast from 'react-hot-toast';

// Mock data for when API isn't connected
const mockLeads: Lead[] = [
  { id: '1', firstName: 'Arjun', lastName: 'Sharma', email: 'arjun@example.com', phone: '9876543210', source: 'website', status: 'new', score: 85, tags: ['hot'], tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '2', firstName: 'Priya', lastName: 'Patel', email: 'priya@example.com', source: 'referral', status: 'qualified', score: 72, tags: [], tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '3', firstName: 'Rahul', lastName: 'Gupta', email: 'rahul@example.com', phone: '9988776655', source: 'social_media', status: 'contacted', score: 45, tags: [], tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '4', firstName: 'Sunita', lastName: 'Kumar', email: 'sunita@example.com', source: 'email', status: 'new', score: 60, tags: [], tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@example.com', source: 'advertisement', status: 'qualified', score: 91, tags: ['vip'], tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
];

export default function LeadsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Lead['status'] | ''>('');
  const [source, setSource] = useState<Lead['source'] | ''>('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useLeads({ search, status: status || undefined, source: source || undefined, page, limit: 10 });
  const { mutateAsync: createLead, isPending } = useCreateLead();

  const leads = data?.data || mockLeads;
  const total = data?.meta?.total || mockLeads.length;
  const totalPages = data?.meta?.totalPages || 1;

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  async function handleCreateLead(formData: CreateLead) {
    try {
      await createLead(formData);
      setShowAddModal(false);
      toast.success('Lead created successfully');
    } catch {
      toast.error('Failed to create lead');
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Leads</h2>
          <p className="text-sm text-slate-500">{total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-1" />
            Import CSV
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters
        search={search}
        status={status}
        source={source}
        onSearchChange={setSearch}
        onStatusChange={(v) => setStatus(v as Lead['status'] | '')}
        onSourceChange={(v) => setSource(v as Lead['source'] | '')}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <PageSpinner />
        ) : leads.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No leads found"
            description="Try adjusting your filters or add a new lead."
            action={{ label: 'Add Lead', onClick: () => setShowAddModal(true) }}
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              onRowClick={(lead) => router.push(`/leads/${lead.id}`)}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={10}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Import Modal */}
      <BulkImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead" size="lg">
        <LeadForm
          onSubmit={(data) => handleCreateLead(data as CreateLead)}
          loading={isPending}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}
