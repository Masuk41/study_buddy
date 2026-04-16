import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  status: 'pending' | 'approved' | 'rejected';
  size?: 'sm' | 'md';
}

const config = {
  pending: {
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Pending'
  },
  approved: {
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-200',
    label: 'Approved'
  },
  rejected: {
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
    label: 'Rejected'
  }
};

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { icon: Icon, className, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 border font-medium rounded-full ${className} ${
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
    }`}>
      <Icon size={size === 'sm' ? 11 : 13} />
      {label}
    </span>
  );
}
