import { useEffect, useRef, useState, useCallback } from "react";
import { CameraSettings } from "@/lib/types";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
  switchCamera: () => Promise<void>;
}

export const useCamera = (settings: CameraSettings): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(settings.facingMode);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: settings.width },
          height: { ideal: settings.height },
          facingMode: facingMode,
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Wait for the video to be ready before playing
        try {
          await videoRef.current.play();
        } catch (playError) {
          // Ignore play errors - the video will auto-play when ready
          console.log("Video play interrupted, will auto-play when ready");
        }
      }

      setStream(mediaStream);
      setHasPermission(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to access camera";
      setError(errorMessage);
      setHasPermission(false);
      
      if (errorMessage.includes("Permission denied")) {
        setError("Camera permission denied. Please allow camera access to use the photobooth.");
      } else if (errorMessage.includes("not found")) {
        setError("No camera found. Please connect a camera and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [settings.width, settings.height, facingMode]);

  const requestPermission = useCallback(async () => {
    await startStream();
  }, [startStream]);

  const switchCamera = useCallback(async () => {
    stopStream();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, [stopStream]);

  useEffect(() => {
    if (hasPermission) {
      startStream();
    }

    return () => {
      stopStream();
    };
  }, [facingMode, hasPermission]);

  useEffect(() => {
    // Check if camera permissions are already granted
    navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
      if (result.state === 'granted') {
        setHasPermission(true);
        startStream();
      }
    }).catch(() => {
      // Permissions API might not be available
      console.log("Permissions API not available");
    });
  }, []);

  return {
    videoRef,
    stream,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    switchCamera,
  };
};