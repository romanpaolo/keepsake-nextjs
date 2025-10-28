import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { AppleTheme, PhotoFilter } from "@/lib/types";
import { applyFilter, addGrain } from "@/lib/filters";

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

          // Add film grain texture to all photos
          addGrain(ctx, canvas.width, canvas.height, 12);

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
          return "photo-mat-border";
        case "imac":
          return "glamour-photo-frame";
        case "aqua":
          return "rounded-lg overflow-hidden shadow-2xl";
        default:
          return "";
      }
    };

    return (
      <div className="relative">
        <div className={`relative ${getThemeClasses()} ${theme === "classic" ? "vintage-viewfinder" : theme === "imac" ? "glamour-viewfinder" : ""}`}>
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

          {/* VINTAGE PHOTOBOOTH OVERLAYS */}
          {theme === "classic" && (
            <>
              {/* Film grain texture */}
              <div className="absolute inset-0 film-grain pointer-events-none" />

              {/* Focus center circle */}
              <div className="focus-center" />

              {/* Film info counter */}
              <div className="film-info">
                24 | {new Date().toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).toUpperCase().replace(' ', " '")}
              </div>

              {/* Ready indicator */}
              <div className="ready-indicator">READY IN 60 SEC</div>

              {/* Light leak overlay */}
              <div className="light-leak-overlay" />

              {/* Date stamp */}
              <div className="vintage-date-stamp">
                {new Date().toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).toUpperCase().replace(' ', " '")}
              </div>
            </>
          )}

          {/* GLAMOUR STUDIO OVERLAYS */}
          {theme === "imac" && (
            <>
              {/* Ring light glow */}
              <div className="ring-light-glow" />

              {/* Glamour vignette */}
              <div className="glamour-vignette" />

              {/* Bokeh particles */}
              <div className="bokeh-overlay" />

              {/* Camera settings display */}
              <div className="camera-settings">f/1.8 | ISO 200</div>

              {/* Glamour status */}
              <div className="glamour-status">Portrait Mode</div>
            </>
          )}

          {theme === "aqua" && (
            <div className="absolute inset-0 scanline pointer-events-none" />
          )}
        </div>

        {/* Film sprocket holes for vintage theme */}
        {theme === "classic" && (
          <>
            <div className="film-sprockets-left" />
            <div className="film-sprockets-right" />
          </>
        )}
      </div>
    );
  }
);

FilteredCameraView.displayName = "FilteredCameraView";

export default FilteredCameraView;