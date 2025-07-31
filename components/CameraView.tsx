import React, { forwardRef } from "react";
import { AppleTheme } from "@/lib/types";

interface CameraViewProps {
  theme: AppleTheme;
  isFlashing: boolean;
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ theme, isFlashing }, ref) => {
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
          <video
            ref={ref}
            className={`w-full h-full object-cover ${
              theme === "classic" ? "dither-pattern" : ""
            }`}
            autoPlay
            playsInline
            muted
          />
          
          {/* Flash effect overlay */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white flash-effect pointer-events-none" />
          )}

          {/* CRT effect for classic theme */}
          {theme === "classic" && (
            <div className="absolute inset-0 crt-effect pointer-events-none" />
          )}

          {/* Scanline effect for aqua theme */}
          {theme === "aqua" && (
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

CameraView.displayName = "CameraView";

export default CameraView;