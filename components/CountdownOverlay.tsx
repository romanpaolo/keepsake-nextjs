import React from "react";
import { AppleTheme } from "@/lib/types";

interface CountdownOverlayProps {
  count: number;
  theme: AppleTheme;
  photoNumber?: number;
  totalPhotos?: number;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ count, theme, photoNumber, totalPhotos }) => {
  const getCountdownStyle = () => {
    switch (theme) {
      case "classic":
        return "font-chicago text-black text-9xl";
      case "imac":
        return "text-imac-bondi-blue text-9xl font-bold";
      case "aqua":
        return "text-9xl font-bold";
      default:
        return "text-9xl font-bold";
    }
  };

  const getCountdownColor = () => {
    switch (theme) {
      case "aqua":
        return "#F9F5E8";
      default:
        return undefined;
    }
  };

  // Check if this is the initial "Get Ready" message (count > 3 means it's a special value)
  const isGetReady = count > 3 || (photoNumber !== undefined && count === -1);

  if (isGetReady && photoNumber !== undefined && totalPhotos !== undefined) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none gap-4">
        <div
          className="text-4xl font-bold"
          style={{
            color: getCountdownColor() || "#000000",
            textShadow: theme === "aqua" ? "0 4px 8px rgba(0, 0, 0, 0.3)" : undefined,
          }}
        >
          GET READY
        </div>
        <div
          className="text-6xl font-bold"
          style={{
            color: getCountdownColor() || "#000000",
            textShadow: theme === "aqua" ? "0 4px 8px rgba(0, 0, 0, 0.3)" : undefined,
          }}
        >
          PHOTO {photoNumber} of {totalPhotos}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`${getCountdownStyle()} animate-pulse transform scale-150`}
        style={{
          color: getCountdownColor(),
          textShadow: theme === "aqua" ? "0 4px 8px rgba(0, 0, 0, 0.3)" : undefined,
        }}
      >
        {count > 0 ? count : ""}
      </div>
    </div>
  );
};

export default CountdownOverlay;