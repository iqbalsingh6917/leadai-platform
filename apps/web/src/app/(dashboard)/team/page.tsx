'use client';

import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { InviteForm } from '@/components/team/InviteForm';
import { useTeamMembers, useUpdateTeamMember, useDeactivateTeamMember } from '@/hooks/useTeam';
import { useAuth } from '@/hooks/useAuth';
import { TeamMember } from '@/types/team';
import toast from 'react-hot-toast';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'agent', label: 'Agent' },
];

const roleBadgeVariant: Record<string, 'info' | 'neutral' | 'success'> = {
  admin: 'info',
  manager: 'info',
  agent: 'success',
};

const roleBadgeClass: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  agent: 'bg-green-100 text-green-700',
};

export default function TeamPage() {
  const { data: members, isLoading } = useTeamMembers();
  const { mutateAsync: updateMember } = useUpdateTeamMember();
  const { mutateAsync: deactivateMember } = useDeactivateTeamMember();
  const { user } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);

  async function handleRoleChange(member: TeamMember, role: string) {
    try {
      await updateMember({ id: member.id, data: { role: role as TeamMember['role'] } });
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  }

  async function handleDeactivate(member: TeamMember) {
    if (!confirm(`Deactivate ${member.firstName} ${member.lastName}?`)) return;
    try {
      await deactivateMember(member.id);
      toast.success('Member deactivated');
    } catch {
      toast.error('Failed to deactivate member');
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
          <p className="text-sm text-slate-500">{members?.length ?? 0} members</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Invite Member
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <PageSpinner />
        ) : !members || members.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No team members"
            description="Invite your first team member to get started."
            action={{ label: 'Invite Member', onClick: () => setShowInviteModal(true) }}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={member.firstName} lastName={member.lastName} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {member.firstName} {member.lastName}
                        </p>
                        {member.phone && (
                          <p className="text-xs text-slate-400">{member.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{member.email}</td>
                  <td className="px-4 py-3">
                    <Select
                      options={roleOptions}
                      value={member.role}
                      onChange={(e) => handleRoleChange(member, e.target.value)}
                      className={`text-xs py-1 px-2 border-0 bg-transparent font-medium cursor-pointer ${roleBadgeClass[member.role]}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={member.isActive ? 'success' : 'neutral'}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {member.isActive && member.id !== user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(member)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        size="md"
      >
        <InviteForm
          onSuccess={() => setShowInviteModal(false)}
          onCancel={() => setShowInviteModal(false)}
        />
      </Modal>
    </div>
  );
}
