import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { AppleTheme, PhotoFilter } from "@/lib/types";
import { applyFilter, addCRTEffect, addScanlines } from "@/lib/filters";

interface FilteredCameraViewProps {
  theme: AppleTheme;
  isFlashing: boolean;
  selectedFilter: PhotoFilter;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface FilteredCameraViewHandle {
  captureFrame: () => string | null;
}

const FilteredCameraView = forwardRef<FilteredCameraViewHandle, FilteredCameraViewProps>(
  ({ theme, isFlashing, selectedFilter, videoRef }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastFilterRef = useRef<PhotoFilter>("none");

    // Expose capture method to parent
    useImperativeHandle(ref, () => ({
      captureFrame: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.toDataURL("image/png");
      }
    }));

    useEffect(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawFrame = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Set canvas size to match video
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          // Clear canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Apply selected filter (only one at a time)
          if (selectedFilter !== "none") {
            applyFilter(canvas, selectedFilter);
          }

          // Apply CRT effect only if it's the selected filter
          if (selectedFilter === "crt") {
            addCRTEffect(canvas);
          }

          // Apply scanlines only if it's the selected filter
          if (selectedFilter === "scanlines") {
            addScanlines(canvas);
          }

          lastFilterRef.current = selectedFilter;
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [videoRef, selectedFilter]);

    const getThemeClasses = () => {
      switch (theme) {
        case "classic":
          return "border-4 border-black bg-black";
        case "imac":
          return "rounded-2xl overflow-hidden border-4 border-imac-bondi-blue";
        case "aqua":
          return "rounded-lg overflow-hidden shadow-2xl";
        default:
          return "";
      }
    };

    return (
      <div className="relative">
        <div className={`relative ${getThemeClasses()}`}>
          {/* Hidden video element */}
          <video
            ref={videoRef}
            className="hidden"
            autoPlay
            playsInline
            muted
          />
          
          {/* Visible canvas with filters */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />
          
          {/* Flash effect overlay */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white flash-effect pointer-events-none" />
          )}

          {/* Theme-specific CSS effects (only when no conflicting filter is selected) */}
          {theme === "classic" && selectedFilter !== "crt" && selectedFilter !== "scanlines" && (
            <div className="absolute inset-0 crt-effect pointer-events-none" />
          )}

          {theme === "aqua" && selectedFilter !== "scanlines" && selectedFilter !== "crt" && (
            <div className="absolute inset-0 scanline pointer-events-none" />
          )}
        </div>

        {/* Theme-specific decorations */}
        {theme === "imac" && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-full" />
        )}
      </div>
    );
  }
);

FilteredCameraView.displayName = "FilteredCameraView";

export default FilteredCameraView;