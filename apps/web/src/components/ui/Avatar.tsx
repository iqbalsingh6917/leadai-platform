'use client';

import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  firstName: string;
  lastName?: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

const colors = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-blue-500',
  'bg-purple-500',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ firstName, lastName, src, size = 'md', className }: AvatarProps) {
  const initials = getInitials(firstName, lastName);
  const color = getColor(firstName + (lastName || ''));

  if (src) {
    return (
      <div className={cn('rounded-full overflow-hidden relative', sizeClasses[size], className)}>
        <Image
          src={src}
          alt={`${firstName} ${lastName}`}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium',
        color,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
