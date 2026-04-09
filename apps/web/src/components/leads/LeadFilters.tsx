'use client';

import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { LeadStatus, LeadSource } from '@/types/lead';

interface LeadFiltersProps {
  search: string;
  status: string;
  source: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSourceChange: (v: string) => void;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
] satisfies { value: LeadStatus; label: string }[];

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
] satisfies { value: LeadSource; label: string }[];

export function LeadFilters({ search, status, source, onSearchChange, onStatusChange, onSourceChange }: LeadFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search leads..."
        className="flex-1 min-w-0"
      />
      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        options={statusOptions}
        placeholder="All Statuses"
        className="w-full sm:w-40"
      />
      <Select
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        options={sourceOptions}
        placeholder="All Sources"
        className="w-full sm:w-40"
      />
    </div>
  );
}
