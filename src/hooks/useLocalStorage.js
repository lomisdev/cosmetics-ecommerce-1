import { useState } from 'react';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';

/**
 * Custom hook for localStorage with React state synchronization
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, function]} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      logger.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
