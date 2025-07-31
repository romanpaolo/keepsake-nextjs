import React from "react";
import Image from "next/image";
import { Photo, AppleTheme } from "@/lib/types";
import { downloadImage, createPhotoStrip } from "@/lib/utils";

interface PhotoStripProps {
  photos: Photo[];
  theme: AppleTheme;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos, theme }) => {
  const handleDownloadSingle = (photo: Photo) => {
    downloadImage(photo.dataUrl, `retro-photo-${photo.timestamp}.png`);
  };

  const handleDownloadStrip = async () => {
    if (photos.length === 0) return;
    
    const stripDataUrl = await createPhotoStrip(photos, theme);
    downloadImage(stripDataUrl, `photo-strip-${Date.now()}.png`);
  };

  const getContainerClass = () => {
    switch (theme) {
      case "classic":
        return "mac-window";
      case "imac":
        return "imac-window";
      case "aqua":
        return "aqua-window";
      default:
        return "";
    }
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 ${getContainerClass()}`}>
      {/* Title Bar */}
      {theme === "classic" && (
        <div className="mac-title-bar">
          <span>Photo Strip</span>
          <button onClick={() => window.location.reload()} className="text-xs">
            ✕
          </button>
        </div>
      )}
      
      {theme === "aqua" && (
        <div className="aqua-title-bar">
          <div className="traffic-lights">
            <div className="traffic-light traffic-light-red" />
            <div className="traffic-light traffic-light-yellow" />
            <div className="traffic-light traffic-light-green" />
          </div>
          <span className="text-sm font-medium text-gray-700 ml-2">Photo Strip</span>
        </div>
      )}

      {/* Photo Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <Image
                src={photo.dataUrl}
                alt={`Photo ${photo.id}`}
                width={400}
                height={300}
                className={`w-full h-auto ${
                  theme === "classic" ? "border-2 border-black" : "rounded-lg shadow-md"
                }`}
                unoptimized
              />
              <button
                onClick={() => handleDownloadSingle(photo)}
                className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                Download
              </button>
            </div>
          ))}
        </div>

        {/* Download Strip Button */}
        {photos.length >= 2 && (
          <div className="text-center">
            <button
              onClick={handleDownloadStrip}
              className={theme === "classic" ? "mac-button" : theme === "imac" ? "imac-button" : "aqua-button"}
            >
              Download Photo Strip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoStrip;