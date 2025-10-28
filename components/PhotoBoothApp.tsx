"use client";

import React, { useState, useCallback, useRef } from "react";
import { AppleTheme, PhotoMode, PhotoFilter, Photo, CameraSettings } from "@/lib/types";
import { useCamera } from "@/hooks/useCamera";
import { useCountdown } from "@/hooks/useCountdown";
import FilteredCameraView, { FilteredCameraViewHandle } from "./FilteredCameraView";
import ControlPanel from "./ControlPanel";
import PhotoStrip from "./PhotoStrip";
import CountdownOverlay from "./CountdownOverlay";
import { generatePhotoId, playSound } from "@/lib/utils";

interface PhotoBoothAppProps {
  theme: AppleTheme;
}

const PhotoBoothApp: React.FC<PhotoBoothAppProps> = ({ theme }) => {
  const [photoMode, setPhotoMode] = useState<PhotoMode>("single");
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>("none");
  const [photosByTheme, setPhotosByTheme] = useState<Record<string, Photo[]>>({
    classic: [],
    imac: [],
    aqua: [],
  });
  const [isFlashing, setIsFlashing] = useState(false);
  
  const filteredCameraRef = useRef<FilteredCameraViewHandle>(null);
  
  const cameraSettings: CameraSettings = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const { videoRef, hasPermission, requestPermission, error, isLoading, switchCamera } = useCamera(cameraSettings);
  const { count, isCountingDown, photoNumber, totalPhotos, startCountdown } = useCountdown();

  const capturePhoto = useCallback(async (): Promise<Photo | null> => {
    const filteredCamera = filteredCameraRef.current;
    
    if (!filteredCamera) return null;

    // Capture the filtered frame from the canvas
    const dataUrl = filteredCamera.captureFrame();
    
    if (!dataUrl) return null;

    return {
      id: generatePhotoId(),
      dataUrl,
      timestamp: Date.now(),
      theme,
      filter: selectedFilter,
    };
  }, [selectedFilter, theme]);

  const handleCapture = useCallback(async () => {
    if (!hasPermission || isCountingDown) return;

    // Capture based on mode
    if (photoMode === "single") {
      // Start countdown
      await startCountdown(3);

      // Flash effect
      setIsFlashing(true);
      playSound("flash");
      setTimeout(() => setIsFlashing(false), 300);

      playSound("shutter");
      const photo = await capturePhoto();
      if (photo) {
        setPhotosByTheme(prev => ({
          ...prev,
          [theme]: [...prev[theme], photo]
        }));
      }
    } else if (photoMode === "burst") {
      // Start countdown
      await startCountdown(3);

      // Flash effect
      setIsFlashing(true);
      playSound("flash");
      setTimeout(() => setIsFlashing(false), 300);

      // Capture 3 photos in quick succession
      for (let i = 0; i < 3; i++) {
        playSound("shutter");
        const photo = await capturePhoto();
        if (photo) {
          setPhotosByTheme(prev => ({
            ...prev,
            [theme]: [...prev[theme], photo]
          }));
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else if (photoMode === "strip") {
      // Capture 4 photos for a strip
      const stripPhotos: Photo[] = [];
      for (let i = 0; i < 4; i++) {
        if (i === 0) {
          // First photo - start countdown
          await startCountdown(3);
        } else {
          // Subsequent photos - get ready message then countdown
          await startCountdown(3, i + 1, 4);
        }

        // Flash effect before each photo
        setIsFlashing(true);
        playSound("flash");
        setTimeout(() => setIsFlashing(false), 300);

        playSound("shutter");
        const photo = await capturePhoto();
        if (photo) {
          stripPhotos.push(photo);
          setPhotosByTheme(prev => ({
            ...prev,
            [theme]: [...prev[theme], photo]
          }));
        }
      }
    }
  }, [hasPermission, isCountingDown, photoMode, capturePhoto, startCountdown, theme]);

  const getWindowClass = () => {
    switch (theme) {
      case "classic":
        return "vintage-booth-frame bg-vintage-booth-cream";
      case "imac":
        return "glamour-window p-6";
      case "aqua":
        return "aqua-window";
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
      {/* Camera Section */}
      <div className={getWindowClass()}>
        {theme === "classic" && (
          <div className="vintage-booth-bar">
            <span>PHOTO BOOTH</span>
            <span style={{ fontSize: '10px', letterSpacing: '1px', opacity: 0.8 }}>EST. 1975</span>
          </div>
        )}

        {theme === "imac" && (
          <div className="glamour-title-bar">
            <span>STUDIO</span>
            <span style={{ fontSize: '10px', letterSpacing: '1.5px', opacity: 0.9 }}>CAPTURE YOUR ELEGANCE</span>
          </div>
        )}

        {theme === "aqua" && (
          <div className="aqua-title-bar">
            <div className="traffic-lights">
              <div className="traffic-light traffic-light-red" />
              <div className="traffic-light traffic-light-yellow" />
              <div className="traffic-light traffic-light-green" />
            </div>
            <span className="text-sm font-medium text-gray-700 ml-2">PhotoBooth</span>
          </div>
        )}

        <div className="p-3 sm:p-4 md:p-6 flex flex-col gap-4">
          {!hasPermission ? (
            <div className="text-center py-12">
              <p className="mb-4 text-base sm:text-lg">Camera access is required to use the photobooth</p>
              <button
                onClick={requestPermission}
                disabled={isLoading}
                className={theme === "classic" ? "vintage-button" : theme === "imac" ? "glamour-button" : "aqua-button"}
              >
                {isLoading ? "Requesting..." : "Allow Camera Access"}
              </button>
              {error && (
                <p className="mt-4 text-red-600">{error}</p>
              )}
            </div>
          ) : (
            <>
              <div className="relative">
                <FilteredCameraView
                  ref={filteredCameraRef}
                  videoRef={videoRef}
                  theme={theme}
                  isFlashing={isFlashing}
                  selectedFilter={selectedFilter}
                />
                {count !== null && <CountdownOverlay count={count} theme={theme} photoNumber={photoNumber} totalPhotos={totalPhotos} />}
              </div>

              {/* Capture Button - Right Below Camera */}
              <div className="flex justify-center gap-3 sm:gap-4">
                {/* Camera Switch Button (Mobile Only) */}
                <button
                  onClick={switchCamera}
                  disabled={!hasPermission || isCountingDown}
                  className="flex lg:hidden items-center justify-center px-4 py-3 text-sm font-bold transition-all rounded-lg"
                  title="Switch camera"
                  style={{
                    background: theme === "classic"
                      ? "rgba(128, 1, 2, 0.3)"
                      : theme === "imac"
                      ? "rgba(212, 175, 55, 0.2)"
                      : "rgba(0, 0, 0, 0.1)",
                    color: theme === "classic" ? "#FFF8DC" : theme === "imac" ? "#D4AF37" : "#000",
                    border: `2px solid ${theme === "classic" ? "rgba(128, 1, 2, 0.5)" : theme === "imac" ? "rgba(212, 175, 55, 0.5)" : "rgba(0, 0, 0, 0.2)"}`,
                  }}
                >
                  📷
                </button>

                <button
                  onClick={handleCapture}
                  disabled={!hasPermission || isCountingDown}
                  className={`px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold transition-all ${
                    theme === "classic" ? "rounded-md" : theme === "imac" ? "rounded-full" : "text-black rounded-lg shadow-lg active:scale-95"
                  }`}
                  style={{
                    background: theme === "classic"
                      ? "radial-gradient(circle at 35% 35%, #800102 0%, #600001 60%, #4A0001 100%)"
                      : theme === "imac"
                      ? "radial-gradient(circle at 30% 30%, #E8B4B8 0%, #D4AF37 100%)"
                      : "linear-gradient(180deg, #FFF9ED 0%, #F9F5E8 50%, #F3EED8 100%)",
                    border: theme === "classic" ? "4px solid rgba(205, 149, 117, 0.5)" : theme === "imac" ? "3px solid #C8A8B8" : "none",
                    color: theme === "classic" ? "#FFF8DC" : theme === "imac" ? "#FFF8F3" : undefined,
                    boxShadow: theme === "classic"
                      ? "inset 2px 2px 8px rgba(255, 248, 220, 0.08), 4px 6px 16px rgba(0, 0, 0, 0.3)"
                      : theme === "imac"
                      ? "0 0 30px rgba(232, 180, 184, 0.4), 0 8px 24px rgba(212, 175, 55, 0.3)"
                      : undefined,
                    width: "auto",
                    minWidth: "140px",
                  }}
                >
                  {isCountingDown ? "Get Ready..." : theme === "imac" ? "CAPTURE" : theme === "classic" ? "TAKE PHOTO" : "Take Photo"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className={getWindowClass()}>
        {theme === "classic" && (
          <div className="vintage-booth-bar">
            <span>ADJUSTMENTS</span>
            <span style={{ fontSize: '10px', letterSpacing: '1px', opacity: 0.8 }}>READY IN 60 SEC</span>
          </div>
        )}

        {theme === "imac" && (
          <div className="glamour-title-bar">
            <span>ENHANCE</span>
            <span style={{ fontSize: '10px', letterSpacing: '1.5px', opacity: 0.9 }}>REFINE YOUR LOOK</span>
          </div>
        )}

        {theme === "aqua" && (
          <div className="aqua-title-bar">
            <div className="traffic-lights">
              <div className="traffic-light traffic-light-red" />
              <div className="traffic-light traffic-light-yellow" />
              <div className="traffic-light traffic-light-green" />
            </div>
            <span className="text-sm font-medium text-gray-700 ml-2">Controls</span>
          </div>
        )}

        <div className="p-3 sm:p-4 md:p-6">
          <ControlPanel
            theme={theme}
            photoMode={photoMode}
            selectedFilter={selectedFilter}
            onPhotoModeChange={setPhotoMode}
            onFilterChange={setSelectedFilter}
            onCapture={handleCapture}
            isCountingDown={isCountingDown}
            canCapture={hasPermission && !isCountingDown}
          />
        </div>
      </div>


      {/* Photo Strip Display */}
      {photosByTheme[theme].length > 0 && (
        <div className="lg:col-span-2">
          <PhotoStrip photos={photosByTheme[theme]} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default PhotoBoothApp;