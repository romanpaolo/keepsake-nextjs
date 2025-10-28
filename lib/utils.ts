import { Photo, PhotoStripLayout } from "./types";

export const generatePhotoId = (): string => {
  return `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createPhotoStrip = async (
  photos: Photo[],
  theme: string
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Print-ready dimensions: 2x6 inches at 300 DPI
  // 2 inches wide × 300 DPI = 600px
  // 6 inches tall × 300 DPI = 1800px
  const printWidth = 600;   // 2 inches at 300 DPI
  const printHeight = 1800; // 6 inches at 300 DPI

  const blackBorder = 60;   // Black border around edge (0.2 inches)
  const padding = 10;       // Space between photos
  const bleedAmount = 3;    // Edge bleeding/overflow amount

  // Calculate photo dimensions maintaining 4:3 aspect ratio
  const photoWidth = printWidth - (blackBorder * 2);  // Full available width
  const totalPadding = (photos.length - 1) * padding;
  const availableHeight = printHeight - (blackBorder * 2) - totalPadding;
  const photoHeight = availableHeight / photos.length; // Equal height for each photo

  // Maintain 4:3 aspect ratio (most camera photos)
  const aspectRatio = 4 / 3;
  let finalPhotoWidth = photoWidth;
  let finalPhotoHeight = photoWidth / aspectRatio;

  // If photo height exceeds available space, scale down
  if (finalPhotoHeight > photoHeight) {
    finalPhotoHeight = photoHeight;
    finalPhotoWidth = photoHeight * aspectRatio;
  }

  // Center photos horizontally within the width
  const photoStartX = blackBorder + (photoWidth - finalPhotoWidth) / 2;

  canvas.width = printWidth;
  canvas.height = printHeight;

  // Black background (film strip look) - completely black
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw photos with edge bleeding effect
  for (let i = 0; i < photos.length; i++) {
    const img = new Image();
    img.src = photos[i].dataUrl;
    await new Promise((resolve) => {
      img.onload = () => {
        // Calculate position for this photo
        const x = photoStartX;
        const y = blackBorder + padding + (i * (photoHeight + padding));

        // Draw photo with slight overflow into padding for bleed effect (maintains aspect ratio)
        ctx.drawImage(img, x - bleedAmount, y - bleedAmount, finalPhotoWidth + (bleedAmount * 2), finalPhotoHeight + (bleedAmount * 2));

        // Add edge blur/fade effect (vignette-like bleeding)
        const blurGradient = ctx.createLinearGradient(x, y, x + finalPhotoWidth, y);
        blurGradient.addColorStop(0, "rgba(0, 0, 0, 0.15)");
        blurGradient.addColorStop(0.1, "rgba(0, 0, 0, 0)");
        blurGradient.addColorStop(0.9, "rgba(0, 0, 0, 0)");
        blurGradient.addColorStop(1, "rgba(0, 0, 0, 0.15)");
        ctx.fillStyle = blurGradient;
        ctx.fillRect(x, y, finalPhotoWidth, finalPhotoHeight);

        // Add vertical edge blur
        const verticalGradient = ctx.createLinearGradient(x, y, x, y + finalPhotoHeight);
        verticalGradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
        verticalGradient.addColorStop(0.08, "rgba(0, 0, 0, 0)");
        verticalGradient.addColorStop(0.92, "rgba(0, 0, 0, 0)");
        verticalGradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        ctx.fillStyle = verticalGradient;
        ctx.fillRect(x, y, finalPhotoWidth, finalPhotoHeight);

        resolve(null);
      };
    });
  }

  // Add date stamp at bottom
  const date = new Date().toLocaleDateString();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "16px monospace";
  ctx.textAlign = "center";
  ctx.fillText(date, canvas.width / 2, canvas.height - 20);

  return canvas.toDataURL("image/png");
};

export const playSound = (soundName: "shutter" | "countdown" | "flash") => {
  // Create audio context for sound effects
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  switch (soundName) {
    case "shutter":
      // Simulate camera shutter sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
      
    case "countdown":
      // Simple beep for countdown
      const beep = audioContext.createOscillator();
      const beepGain = audioContext.createGain();
      
      beep.connect(beepGain);
      beepGain.connect(audioContext.destination);
      
      beep.frequency.value = 800;
      beepGain.gain.setValueAtTime(0.2, audioContext.currentTime);
      beepGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      beep.start(audioContext.currentTime);
      beep.stop(audioContext.currentTime + 0.05);
      break;
      
    case "flash":
      // White noise burst for flash
      const bufferSize = audioContext.sampleRate * 0.05;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      
      whiteNoise.buffer = buffer;
      whiteNoise.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      
      noiseGain.gain.setValueAtTime(0.1, audioContext.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      whiteNoise.start(audioContext.currentTime);
      break;
  }
};