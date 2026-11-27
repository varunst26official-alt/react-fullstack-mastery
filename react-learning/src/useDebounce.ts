import { useState, useEffect } from 'react';

/**
 * useDebounce Custom Hook:
 * Defers updating 'debouncedValue' until the user has stopped changing 'value' for 'delay' ms.
 * Under the hood: Uses setTimeout + useEffect cleanup function to cancel pending executions.
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 1. Start timer countdown
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. CLEANUP FUNCTION:
    // If 'value' changes before 'delay' finishes, React executes this cleanup FIRST,
    // cancelling the previous pending timer before launching a new one!
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
