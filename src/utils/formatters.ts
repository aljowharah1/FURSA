export function formatSalary(amount: string | number | undefined): string {
  if (!amount) return 'Not specified';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  if (isNaN(num)) return String(amount);
  return `SAR ${num.toLocaleString('en-US')}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Saved: 'bg-gray-100 text-gray-700',
    Needs_Manual_Action: 'bg-yellow-100 text-yellow-700',
    Auto_Applied: 'bg-blue-100 text-blue-700',
    Submitted: 'bg-indigo-100 text-indigo-700',
    Under_Review: 'bg-purple-100 text-purple-700',
    Interview_Scheduled: 'bg-cyan-100 text-cyan-700',
    Offer_Received: 'bg-green-100 text-green-700',
    Accepted: 'bg-emerald-100 text-emerald-800',
    Rejected: 'bg-red-100 text-red-700',
    Withdrawn: 'bg-orange-100 text-orange-700',
    Open: 'bg-green-100 text-green-700',
    'Closing Soon': 'bg-amber-100 text-amber-700',
    Closed: 'bg-red-100 text-red-700',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-700';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    Saved: 'Saved',
    Needs_Manual_Action: 'Needs Manual Action',
    Auto_Applied: 'Auto Applied',
    Submitted: 'Submitted',
    Under_Review: 'Under Review',
    Interview_Scheduled: 'Interview Scheduled',
    Offer_Received: 'Offer Received',
    Accepted: 'Accepted',
    Rejected: 'Rejected',
    Withdrawn: 'Withdrawn',
  };
  return labels[status] ?? status;
}
