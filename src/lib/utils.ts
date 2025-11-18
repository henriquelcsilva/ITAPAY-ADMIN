import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-primary-50 text-primary-700',
    approved: 'bg-primary-50 text-primary-700',
    pending: 'bg-accent-50 text-accent-700',
    pending_kyc: 'bg-accent-50 text-accent-700',
    rejected: 'bg-red-50 text-red-700',
    open: 'bg-primary-50 text-primary-700',
    closed: 'bg-dark-100 text-dark-700',
    completed: 'bg-primary-50 text-primary-700',
    processing: 'bg-blue-50 text-blue-700',
    failed: 'bg-red-50 text-red-700',
  };
  
  return colors[status] || 'bg-dark-100 text-dark-700';
}
