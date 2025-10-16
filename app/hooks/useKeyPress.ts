import { useEffect } from 'react';

// Define the callback's type signature separately for clarity
type KeyPressCallback = (event: KeyboardEvent) => void;

export const useKeyPress = (targetKey: string, callback: KeyPressCallback): void => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    
    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [targetKey, callback]); // Dependencies for the effect
};
