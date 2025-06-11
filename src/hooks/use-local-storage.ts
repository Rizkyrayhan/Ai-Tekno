
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
        // Ensure timestamps are rehydrated as Date objects
        if (Array.isArray(parsed)) {
          return parsed.map(msg => (msg && msg.timestamp && typeof msg.timestamp === 'string') ? {...msg, timestamp: new Date(msg.timestamp)} : msg) as T;
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

  const setValue: SetValue<T> = useCallback(
    (valueOrUpdater: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
        return;
      }
      try {
        // Use the functional update form of setStoredValue to ensure we operate on the latest state.
        // Determine the newValue, then set localStorage and return it for the React state update.
        setStoredValue(prevStoredValue => {
          const newValue =
            valueOrUpdater instanceof Function
              ? valueOrUpdater(prevStoredValue)
              : valueOrUpdater;
          window.localStorage.setItem(key, JSON.stringify(newValue));
          return newValue;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key] // setValue now only depends on `key`. `setStoredValue` is stable.
  );
  

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key || event.key === null) { 
        setStoredValue(currentStoredValue => {
          const newValueFromStorage = readValue();
          if (JSON.stringify(newValueFromStorage) !== JSON.stringify(currentStoredValue)) {
            return newValueFromStorage;
          }
          return currentStoredValue;
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;

