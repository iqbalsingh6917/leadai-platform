'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { LeadDetail } from '@/components/leads/LeadDetail';
import { LeadForm } from '@/components/leads/LeadForm';
import { useLead, useUpdateLead } from '@/hooks/useLeads';
import { UpdateLead, Lead } from '@/types/lead';
import toast from 'react-hot-toast';

// Mock lead for when API isn't connected
const mockLead: Lead = {
  id: '1',
  firstName: 'Arjun',
  lastName: 'Sharma',
  email: 'arjun@example.com',
  phone: '9876543210',
  company: 'TechCorp India',
  source: 'website',
  status: 'qualified',
  score: 85,
  notes: 'Interested in enterprise plan. Follow up needed.',
  tags: ['hot', 'enterprise'],
  tenantId: 't1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: lead, isLoading } = useLead(id);
  const { mutateAsync: updateLead, isPending } = useUpdateLead();

  const displayLead = lead || mockLead;

  async function handleUpdate(data: UpdateLead) {
    try {
      await updateLead({ id, data });
      setShowEditModal(false);
      toast.success('Lead updated successfully');
    } catch {
      toast.error('Failed to update lead');
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <>
      <LeadDetail lead={displayLead} onEdit={() => setShowEditModal(true)} />
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Lead" size="lg">
        <LeadForm
          initialData={displayLead}
          onSubmit={(data) => handleUpdate(data as UpdateLead)}
          loading={isPending}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
}
