
"use client";

import { useState, useEffect, useCallback } from 'react';

export type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          return parsed.map(msg => msg.timestamp ? {...msg, timestamp: new Date(msg.timestamp)} : msg) as T;
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(() => readValue());

  const setValue: SetValue<T> = useCallback(value => {
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
      return;
    }
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      // Removed: window.dispatchEvent(new StorageEvent('local-storage', { key }));
      // Standard 'storage' event will notify other tabs/windows.
      // This instance has already updated its state with setStoredValue(newValue).
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);
  

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Listen for changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key || event.key === null) { // event.key is null for localStorage.clear()
        setStoredValue(currentStoredValue => {
          const newValueFromStorage = readValue();
          // Compare to prevent re-render if data is identical.
          // This is important as 'storage' event can fire even for no-op changes from other tabs.
          if (JSON.stringify(newValueFromStorage) !== JSON.stringify(currentStoredValue)) {
            return newValueFromStorage;
          }
          return currentStoredValue;
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Removed listener for 'local-storage' custom event
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // Removed listener for 'local-storage' custom event
    };
  }, [key, readValue]); // readValue is stable if initialValue and key are stable

  return [storedValue, setValue];
}

export default useLocalStorage;
