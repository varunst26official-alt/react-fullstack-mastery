import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 1. useDebounce: Delays updating a value until user stops typing (e.g. search bars)
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * 2. useClickOutside: Closes dropdowns, modals, and tooltips when clicking outside
 */
export function useClickOutside<TElement extends HTMLElement = HTMLElement>(
  callback: () => void
): React.RefObject<TElement | null> {
  const ref = useRef<TElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback]);

  return ref;
}

/**
 * 3. usePrevious: Tracks previous value of a state or prop for diffing
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
