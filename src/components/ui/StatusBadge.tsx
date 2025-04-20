import React from 'react';
import Badge from './Badge';
import type { Order } from '../../lib/api';

type StatusBadgeProps = {
  status: Order['status'];
  size?: 'sm' | 'md';
  className?: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const statusConfig = {
    pending: {
      variant: 'warning' as const,
      label: 'Pending',
    },
    in_progress: {
      variant: 'info' as const,
      label: 'In Progress',
    },
    delivered: {
      variant: 'success' as const,
      label: 'Delivered',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;