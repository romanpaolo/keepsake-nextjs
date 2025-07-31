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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  
  const filteredCameraRef = useRef<FilteredCameraViewHandle>(null);
  
  const cameraSettings: CameraSettings = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const { videoRef, hasPermission, requestPermission, error, isLoading } = useCamera(cameraSettings);
  const { count, isCountingDown, startCountdown } = useCountdown();

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

    // Start countdown
    await startCountdown(3);

    // Flash effect
    setIsFlashing(true);
    playSound("flash");
    setTimeout(() => setIsFlashing(false), 300);

    // Capture based on mode
    if (photoMode === "single") {
      playSound("shutter");
      const photo = await capturePhoto();
      if (photo) {
        setPhotos(prev => [...prev, photo]);
      }
    } else if (photoMode === "burst") {
      // Capture 3 photos in quick succession
      for (let i = 0; i < 3; i++) {
        playSound("shutter");
        const photo = await capturePhoto();
        if (photo) {
          setPhotos(prev => [...prev, photo]);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else if (photoMode === "strip") {
      // Capture 4 photos for a strip
      const stripPhotos: Photo[] = [];
      for (let i = 0; i < 4; i++) {
        if (i > 0) {
          await startCountdown(3);
        }
        playSound("shutter");
        const photo = await capturePhoto();
        if (photo) {
          stripPhotos.push(photo);
          setPhotos(prev => [...prev, photo]);
        }
      }
    }
  }, [hasPermission, isCountingDown, photoMode, capturePhoto, startCountdown]);

  const getWindowClass = () => {
    switch (theme) {
      case "classic":
        return "mac-window";
      case "imac":
        return "imac-window p-6";
      case "aqua":
        return "aqua-window";
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Camera Section */}
      <div className={getWindowClass()}>
        {theme === "classic" && (
          <div className="mac-title-bar">
            <span>PhotoBooth</span>
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

        <div className="p-6">
          {!hasPermission ? (
            <div className="text-center py-12">
              <p className="mb-4 text-lg">Camera access is required to use the photobooth</p>
              <button
                onClick={requestPermission}
                disabled={isLoading}
                className={theme === "classic" ? "mac-button" : theme === "imac" ? "imac-button" : "aqua-button"}
              >
                {isLoading ? "Requesting..." : "Allow Camera Access"}
              </button>
              {error && (
                <p className="mt-4 text-red-600">{error}</p>
              )}
            </div>
          ) : (
            <div className="relative">
              <FilteredCameraView 
                ref={filteredCameraRef}
                videoRef={videoRef}
                theme={theme} 
                isFlashing={isFlashing}
                selectedFilter={selectedFilter}
              />
              {count !== null && <CountdownOverlay count={count} theme={theme} />}
            </div>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className={getWindowClass()}>
        {theme === "classic" && (
          <div className="mac-title-bar">
            <span>Controls</span>
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

        <div className="p-6">
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
      {photos.length > 0 && (
        <div className="lg:col-span-2">
          <PhotoStrip photos={photos} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default PhotoBoothApp;