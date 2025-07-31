import { useState, useCallback, useEffect, useRef } from "react";
import { playSound } from "@/lib/utils";

interface UseCountdownReturn {
  count: number | null;
  isCountingDown: boolean;
  startCountdown: (duration: number) => Promise<void>;
}

export const useCountdown = (): UseCountdownReturn => {
  const [count, setCount] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);

  const startCountdown = useCallback((duration: number): Promise<void> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setCount(duration);
      setIsCountingDown(true);

      let currentCount = duration;
      
      // Play initial countdown sound
      playSound("countdown");

      intervalRef.current = setInterval(() => {
        currentCount -= 1;
        
        if (currentCount > 0) {
          setCount(currentCount);
          playSound("countdown");
        } else {
          // Countdown finished
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          setCount(null);
          setIsCountingDown(false);
          
          if (resolveRef.current) {
            resolveRef.current();
            resolveRef.current = null;
          }
        }
      }, 1000);
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    count,
    isCountingDown,
    startCountdown,
  };
};