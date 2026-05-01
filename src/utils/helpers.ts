import { v4 as uuidv4 } from 'uuid';
import { clsx, type ClassValue } from 'clsx';

export function generateId(): string {
  return uuidv4();
}

export function classNames(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
