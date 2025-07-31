import React from "react";
import { PhotoMode, PhotoFilter, AppleTheme } from "@/lib/types";

interface ControlPanelProps {
  theme: AppleTheme;
  photoMode: PhotoMode;
  selectedFilter: PhotoFilter;
  onPhotoModeChange: (mode: PhotoMode) => void;
  onFilterChange: (filter: PhotoFilter) => void;
  onCapture: () => void;
  isCountingDown: boolean;
  canCapture: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  theme,
  photoMode,
  selectedFilter,
  onPhotoModeChange,
  onFilterChange,
  onCapture,
  isCountingDown,
  canCapture,
}) => {
  const modes: PhotoMode[] = ["single", "burst", "strip"];
  const filters: PhotoFilter[] = ["none", "dither", "crt", "sepia", "ascii", "pixelate", "scanlines", "matrix", "gameboy", "thermal", "vhs"];

  const getButtonClass = () => {
    switch (theme) {
      case "classic":
        return "mac-button";
      case "imac":
        return "imac-button";
      case "aqua":
        return "aqua-button";
      default:
        return "";
    }
  };

  const getCaptureButtonClass = () => {
    const baseClass = "px-8 py-4 text-lg font-bold transition-all ";
    switch (theme) {
      case "classic":
        return baseClass + "bg-black text-white border-4 border-black hover:bg-white hover:text-black active:bg-gray-700";
      case "imac":
        return baseClass + "bg-imac-bondi-blue text-white rounded-full hover:bg-opacity-90 active:scale-95";
      case "aqua":
        return baseClass + "bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-700 active:scale-95";
      default:
        return baseClass;
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo Mode Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Photo Mode</h3>
        <div className="flex gap-2 flex-wrap">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => onPhotoModeChange(mode)}
              className={`${getButtonClass()} ${
                photoMode === mode ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`${getButtonClass()} text-sm ${
                selectedFilter === filter ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Capture Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onCapture}
          disabled={!canCapture || isCountingDown}
          className={getCaptureButtonClass()}
        >
          {isCountingDown ? "Get Ready..." : "Take Photo"}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;