import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Storage full or unavailable
    }
  }, [key, storedValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        return nextValue;
      });
    },
    []
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch {
      // Ignore
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}
