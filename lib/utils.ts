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
  const blackBorder = 40; // Thick black film strip border
  const bleedAmount = 3;  // Edge bleeding/overflow amount

  canvas.width = photoWidth + (padding * 2) + (blackBorder * 2);
  canvas.height = (photoHeight * photos.length) + (padding * (photos.length + 1)) + (blackBorder * 2);

  // Black background (film strip look) - completely black
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw photos with edge bleeding effect
  for (let i = 0; i < photos.length; i++) {
    const img = new Image();
    img.src = photos[i].dataUrl;
    await new Promise((resolve) => {
      img.onload = () => {
        const x = blackBorder + padding;
        const y = blackBorder + padding + (i * (photoHeight + padding));

        // Draw photo with slight overflow into padding for bleed effect
        ctx.drawImage(img, x - bleedAmount, y - bleedAmount, photoWidth + (bleedAmount * 2), photoHeight + (bleedAmount * 2));

        // Add edge blur/fade effect (vignette-like bleeding)
        const blurGradient = ctx.createLinearGradient(x, y, x + photoWidth, y);
        blurGradient.addColorStop(0, "rgba(0, 0, 0, 0.15)");
        blurGradient.addColorStop(0.1, "rgba(0, 0, 0, 0)");
        blurGradient.addColorStop(0.9, "rgba(0, 0, 0, 0)");
        blurGradient.addColorStop(1, "rgba(0, 0, 0, 0.15)");
        ctx.fillStyle = blurGradient;
        ctx.fillRect(x, y, photoWidth, photoHeight);

        // Add vertical edge blur
        const verticalGradient = ctx.createLinearGradient(x, y, x, y + photoHeight);
        verticalGradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
        verticalGradient.addColorStop(0.08, "rgba(0, 0, 0, 0)");
        verticalGradient.addColorStop(0.92, "rgba(0, 0, 0, 0)");
        verticalGradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        ctx.fillStyle = verticalGradient;
        ctx.fillRect(x, y, photoWidth, photoHeight);

        resolve(null);
      };
    });
  }

  // Add date stamp
  const date = new Date().toLocaleDateString();
  ctx.fillStyle = theme === "classic" ? "#000000" : "#666666";
  ctx.font = theme === "classic" ? "12px monospace" : "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(date, canvas.width / 2, canvas.height - (blackBorder / 2));

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