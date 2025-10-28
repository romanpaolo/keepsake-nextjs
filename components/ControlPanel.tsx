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
  const filters: PhotoFilter[] = ["none", "35mm-film", "vintage-sepia", "bw-minimal", "bw-v3", "kodak-film", "kodak-portra"];

  const getFilterDisplayName = (filter: PhotoFilter): string => {
    const nameMap: Record<PhotoFilter, string> = {
      'none': 'None',
      '35mm-film': '35mm Film',
      'vintage-sepia': 'Vintage',
      'bw-minimal': 'B&W Minimal',
      'bw-v3': 'B&W V3',
      'kodak-film': 'Kodak Film',
      'kodak-portra': 'Kodak Portra 400',
    };
    return nameMap[filter];
  };

  const getButtonClass = () => {
    switch (theme) {
      case "classic":
        return "vintage-button";
      case "imac":
        return "glamour-button";
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
        return baseClass + "rounded-md";
      case "imac":
        return baseClass + "rounded-full";
      case "aqua":
        return baseClass + "text-black rounded-lg shadow-lg active:scale-95";
      default:
        return baseClass;
    }
  };

  const getCaptureButtonStyle = () => {
    if (theme === "classic") {
      return {
        background: "radial-gradient(circle at 35% 35%, #800102 0%, #600001 60%, #4A0001 100%)",
        border: "4px solid rgba(205, 149, 117, 0.5)",
        color: "#FFF8DC",
        boxShadow: "inset 2px 2px 8px rgba(255, 248, 220, 0.08), 4px 6px 16px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(128, 1, 2, 0.2)",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
        textTransform: "uppercase" as const,
        letterSpacing: "2px",
        borderRadius: "50%",
        width: "150px",
        height: "150px",
        fontSize: "16px",
        fontWeight: "600" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', 'Playfair Display', serif",
      };
    }
    if (theme === "imac") {
      return {
        background: "radial-gradient(circle at 30% 30%, #E8B4B8 0%, #D4AF37 100%)",
        border: "3px solid #C8A8B8",
        color: "#FFF8F3",
        boxShadow: "0 0 30px rgba(232, 180, 184, 0.4), 0 8px 24px rgba(212, 175, 55, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
        textShadow: "0 2px 4px rgba(112, 66, 20, 0.3)",
        textTransform: "uppercase" as const,
        letterSpacing: "3px",
        width: "160px",
        height: "160px",
        fontSize: "15px",
        fontWeight: "700" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
        animation: "pulse 2s ease-in-out infinite",
      };
    }
    if (theme === "aqua") {
      return {
        background: "linear-gradient(180deg, #FFF9ED 0%, #F9F5E8 50%, #F3EED8 100%)",
      };
    }
    return {};
  };

  return (
    <div className="space-y-6">
      {/* Vintage carnival signage */}
      {theme === "classic" && (
        <div className="text-center mb-4">
          <span className="booth-signage">★ SAY CHEESE! ★</span>
        </div>
      )}

      {/* Photo Mode Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          {theme === "classic" ? "ADJUSTMENTS" : theme === "imac" ? "SETTINGS" : "Photo Mode"}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => onPhotoModeChange(mode)}
              className={`${getButtonClass()} ${
                photoMode === mode ? "ring-2 ring-offset-2" : ""
              } ${theme === "classic" ? "ring-vintage-booth-burgundy" : theme === "imac" ? "ring-glamour-soft-gold" : "ring-black"}`}
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
                selectedFilter === filter ? "ring-2 ring-offset-2" : ""
              } ${theme === "classic" ? "ring-vintage-booth-burgundy" : theme === "imac" ? "ring-glamour-soft-gold" : "ring-black"}`}
            >
              {getFilterDisplayName(filter)}
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
          style={getCaptureButtonStyle()}
        >
          {isCountingDown ? "Get Ready..." : theme === "imac" ? "CAPTURE" : theme === "classic" ? "TAKE PHOTO" : "Take Photo"}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;