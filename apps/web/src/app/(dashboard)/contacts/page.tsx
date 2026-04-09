'use client';

import { useState } from 'react';
import { Plus, Contact } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { ContactTable } from '@/components/contacts/ContactTable';
import { ContactForm } from '@/components/contacts/ContactForm';
import { useContacts, useCreateContact } from '@/hooks/useContacts';
import { Contact as ContactType, CreateContact } from '@/types/contact';
import toast from 'react-hot-toast';

const mockContacts: ContactType[] = [
  { id: '1', firstName: 'Arjun', lastName: 'Sharma', email: 'arjun@infosys.com', phone: '9876543210', company: 'Infosys', lifecycleStage: 'customer', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '2', firstName: 'Priya', lastName: 'Patel', email: 'priya@wipro.com', company: 'Wipro', lifecycleStage: 'opportunity', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '3', firstName: 'Rahul', lastName: 'Gupta', email: 'rahul@tcs.com', company: 'TCS', lifecycleStage: 'sales_qualified_lead', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
];

const lifecycleOptions = [
  { value: 'subscriber', label: 'Subscriber' },
  { value: 'lead', label: 'Lead' },
  { value: 'marketing_qualified_lead', label: 'MQL' },
  { value: 'sales_qualified_lead', label: 'SQL' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'customer', label: 'Customer' },
  { value: 'evangelist', label: 'Evangelist' },
];

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading } = useContacts({ search, lifecycleStage: lifecycleStage || undefined, page, limit: 10 });
  const { mutateAsync: createContact, isPending } = useCreateContact();

  const contacts = data?.data || mockContacts;
  const total = data?.meta?.total || mockContacts.length;
  const totalPages = data?.meta?.totalPages || 1;

  async function handleCreate(formData: CreateContact) {
    try {
      await createContact(formData);
      setShowAddModal(false);
      toast.success('Contact created successfully');
    } catch {
      toast.error('Failed to create contact');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
          <p className="text-sm text-slate-500">{total} total contacts</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search contacts..."
          className="flex-1 min-w-0"
        />
        <Select
          value={lifecycleStage}
          onChange={(e) => setLifecycleStage(e.target.value)}
          options={lifecycleOptions}
          placeholder="All Stages"
          className="w-full sm:w-48"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <PageSpinner />
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={<Contact className="w-8 h-8" />}
            title="No contacts found"
            description="Add your first contact to get started."
            action={{ label: 'Add Contact', onClick: () => setShowAddModal(true) }}
          />
        ) : (
          <>
            <ContactTable contacts={contacts} />
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

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Contact" size="lg">
        <ContactForm
          onSubmit={(data) => handleCreate(data as CreateContact)}
          loading={isPending}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}
