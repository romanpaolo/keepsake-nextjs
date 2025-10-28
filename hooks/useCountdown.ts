import { useState, useCallback, useEffect, useRef } from "react";
import { playSound } from "@/lib/utils";

interface UseCountdownReturn {
  count: number | null;
  isCountingDown: boolean;
  photoNumber?: number;
  totalPhotos?: number;
  startCountdown: (duration: number, photoNumber?: number, totalPhotos?: number) => Promise<void>;
}

export const useCountdown = (): UseCountdownReturn => {
  const [count, setCount] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [photoNumber, setPhotoNumber] = useState<number>();
  const [totalPhotos, setTotalPhotos] = useState<number>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback((duration: number, photoNum?: number, totalNum?: number): Promise<void> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setIsCountingDown(true);

      if (photoNum !== undefined && totalNum !== undefined) {
        setPhotoNumber(photoNum);
        setTotalPhotos(totalNum);
        // Show "Get Ready" message for 2 seconds
        setCount(4); // Use 4 to trigger the "Get Ready" display logic

        timeoutRef.current = setTimeout(() => {
          // Then start the actual countdown
          setPhotoNumber(undefined);
          setTotalPhotos(undefined);
          setCount(duration);

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
        }, 2000); // Show "Get Ready" for 2 seconds
      } else {
        // Original countdown behavior (no get ready message)
        setCount(duration);

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
      }
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    count,
    isCountingDown,
    photoNumber,
    totalPhotos,
    startCountdown,
  };
};