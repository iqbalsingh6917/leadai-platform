'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useInviteTeamMember } from '@/hooks/useTeam';
import { InviteTeamMember } from '@/types/team';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

interface InviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'agent', label: 'Agent' },
];

export function InviteForm({ onSuccess, onCancel }: InviteFormProps) {
  const { mutateAsync: invite, isPending } = useInviteTeamMember();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<InviteTeamMember>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'agent',
    phone: '',
  });

  function handleChange(field: keyof InviteTeamMember, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: InviteTeamMember = { ...form };
      if (!payload.phone) delete payload.phone;
      await invite(payload);
      toast.success(`${form.firstName} ${form.lastName} has been invited`);
      onSuccess();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to invite member';
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={form.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />
        <Input
          label="Last Name"
          value={form.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <Select
        label="Role"
        options={roleOptions}
        value={form.role}
        onChange={(e) => handleChange('role', e.target.value)}
      />
      <Input
        label="Phone (optional)"
        value={form.phone || ''}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Inviting…' : 'Invite Member'}
        </Button>
      </div>
    </form>
  );
}
