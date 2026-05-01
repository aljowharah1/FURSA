import { format, formatDistanceToNow, differenceInDays, isPast, parseISO } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function daysUntil(dateString: string): number {
  try {
    return differenceInDays(parseISO(dateString), new Date());
  } catch {
    return 0;
  }
}

export function isOverdue(dateString: string): boolean {
  try {
    return isPast(parseISO(dateString));
  } catch {
    return false;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}
