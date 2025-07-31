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
  
  const photoWidth = 400;
  const photoHeight = 300;
  const padding = 20;
  const borderWidth = 10;
  
  canvas.width = photoWidth + (padding * 2) + (borderWidth * 2);
  canvas.height = (photoHeight * photos.length) + (padding * (photos.length + 1)) + (borderWidth * 2);
  
  // Background based on theme
  if (theme === "classic") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);
  } else if (theme === "imac") {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#E6F3F7");
    gradient.addColorStop(1, "#C1E4F0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (theme === "aqua") {
    ctx.fillStyle = "#F0F0F0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw photos
  for (let i = 0; i < photos.length; i++) {
    const img = new Image();
    img.src = photos[i].dataUrl;
    await new Promise((resolve) => {
      img.onload = () => {
        const y = borderWidth + padding + (i * (photoHeight + padding));
        ctx.drawImage(img, borderWidth + padding, y, photoWidth, photoHeight);
        
        // Add frame for each photo
        if (theme === "classic") {
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.strokeRect(borderWidth + padding, y, photoWidth, photoHeight);
        }
        
        resolve(null);
      };
    });
  }
  
  // Add date stamp
  const date = new Date().toLocaleDateString();
  ctx.fillStyle = theme === "classic" ? "#000000" : "#666666";
  ctx.font = theme === "classic" ? "12px monospace" : "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(date, canvas.width / 2, canvas.height - padding);
  
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