import { PhotoFilter } from "./types";

export const applyFilter = (
  canvas: HTMLCanvasElement,
  filter: PhotoFilter
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filter) {
    case "dither":
      applyDitherFilter(data, canvas.width, canvas.height);
      break;
    case "sepia":
      applySepiaFilter(data);
      break;
    case "pixelate":
      applyPixelateFilter(ctx, canvas.width, canvas.height, 8);
      return; // Skip putImageData as pixelate modifies canvas directly
    case "ascii":
      applyAsciiFilter(ctx, canvas.width, canvas.height);
      return; // Skip putImageData as ASCII modifies canvas directly
    case "matrix":
      applyMatrixFilter(ctx, canvas.width, canvas.height);
      return; // Skip putImageData as Matrix modifies canvas directly
    case "gameboy":
      applyGameBoyFilter(data);
      break;
    case "thermal":
      applyThermalFilter(data);
      break;
    case "vhs":
      applyVHSFilter(ctx, canvas.width, canvas.height);
      return; // Skip putImageData as VHS modifies canvas directly
    case "none":
    default:
      return;
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyDitherFilter = (data: Uint8ClampedArray, width: number, height: number) => {
  // Floyd-Steinberg dithering for classic Mac look
  const oldData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Convert to grayscale
      const gray = 0.299 * oldData[idx] + 0.587 * oldData[idx + 1] + 0.114 * oldData[idx + 2];
      const newVal = gray > 128 ? 255 : 0;
      
      const error = gray - newVal;
      
      data[idx] = newVal;
      data[idx + 1] = newVal;
      data[idx + 2] = newVal;
      
      // Distribute error to neighboring pixels (with bounds checking)
      if (x < width - 1) {
        const rightIdx = idx + 4;
        if (rightIdx < data.length - 2) {
          data[rightIdx] = Math.max(0, Math.min(255, data[rightIdx] + error * 7 / 16));
          data[rightIdx + 1] = Math.max(0, Math.min(255, data[rightIdx + 1] + error * 7 / 16));
          data[rightIdx + 2] = Math.max(0, Math.min(255, data[rightIdx + 2] + error * 7 / 16));
        }
      }
      
      if (y < height - 1) {
        if (x > 0) {
          const bottomLeftIdx = idx + (width - 1) * 4;
          if (bottomLeftIdx < data.length - 2 && bottomLeftIdx >= 0) {
            data[bottomLeftIdx] = Math.max(0, Math.min(255, data[bottomLeftIdx] + error * 3 / 16));
            data[bottomLeftIdx + 1] = Math.max(0, Math.min(255, data[bottomLeftIdx + 1] + error * 3 / 16));
            data[bottomLeftIdx + 2] = Math.max(0, Math.min(255, data[bottomLeftIdx + 2] + error * 3 / 16));
          }
        }
        
        const bottomIdx = idx + width * 4;
        if (bottomIdx < data.length - 2) {
          data[bottomIdx] = Math.max(0, Math.min(255, data[bottomIdx] + error * 5 / 16));
          data[bottomIdx + 1] = Math.max(0, Math.min(255, data[bottomIdx + 1] + error * 5 / 16));
          data[bottomIdx + 2] = Math.max(0, Math.min(255, data[bottomIdx + 2] + error * 5 / 16));
        }
        
        if (x < width - 1) {
          const bottomRightIdx = idx + (width + 1) * 4;
          if (bottomRightIdx < data.length - 2) {
            data[bottomRightIdx] = Math.max(0, Math.min(255, data[bottomRightIdx] + error * 1 / 16));
            data[bottomRightIdx + 1] = Math.max(0, Math.min(255, data[bottomRightIdx + 1] + error * 1 / 16));
            data[bottomRightIdx + 2] = Math.max(0, Math.min(255, data[bottomRightIdx + 2] + error * 1 / 16));
          }
        }
      }
    }
  }
};

const applySepiaFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }
};

const applyPixelateFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelSize: number
) => {
  ctx.imageSmoothingEnabled = false;
  
  // Create a temporary canvas for scaling
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;
  
  const scaledWidth = Math.ceil(width / pixelSize);
  const scaledHeight = Math.ceil(height / pixelSize);
  
  tempCanvas.width = scaledWidth;
  tempCanvas.height = scaledHeight;
  
  // Draw scaled down version
  tempCtx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight);
  
  // Clear and draw scaled up version
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);
  
  // Re-enable image smoothing for other operations
  ctx.imageSmoothingEnabled = true;
};

const applyAsciiFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  const ascii = " .:-=+*#%@";
  const blockSize = 8;
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.font = "10px monospace";
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let brightness = 0;
      let count = 0;
      
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          brightness += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          count++;
        }
      }
      
      brightness = brightness / count;
      const charIndex = Math.floor((brightness / 255) * (ascii.length - 1));
      ctx.fillText(ascii[charIndex], x, y + blockSize);
    }
  }
};

export const addCRTEffect = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Add subtle green tint
  ctx.fillStyle = "rgba(0, 255, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add vignette
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) / 2
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const addScanlines = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 1;

  for (let y = 0; y < canvas.height; y += 2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

// Matrix-style falling characters state
interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  charIndex: number;
}

let matrixColumns: MatrixColumn[] = [];
let matrixLastUpdate = 0;

const applyMatrixFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // Matrix character set (katakana, numbers, symbols)
  const matrixChars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789+-*/=<>[]{}";
  
  // Get current image data and apply green monochrome effect
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Convert to green monochrome with high contrast
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const intensity = gray > 128 ? 255 : Math.floor(gray * 0.7); // High contrast
    
    data[i] = 0; // Red = 0
    data[i + 1] = intensity; // Green = processed intensity
    data[i + 2] = 0; // Blue = 0
    // Alpha stays the same
  }
  
  // Put the processed image back
  ctx.putImageData(imageData, 0, 0);
  
  // Initialize matrix columns if needed
  const columnWidth = 20;
  const numColumns = Math.ceil(width / columnWidth);
  
  if (matrixColumns.length !== numColumns) {
    matrixColumns = [];
    for (let i = 0; i < numColumns; i++) {
      matrixColumns.push({
        x: i * columnWidth,
        y: Math.random() * height,
        speed: 2 + Math.random() * 8,
        chars: Array.from({ length: 20 }, () => 
          matrixChars[Math.floor(Math.random() * matrixChars.length)]
        ),
        charIndex: 0,
      });
    }
  }
  
  // Update matrix animation
  const currentTime = Date.now();
  if (currentTime - matrixLastUpdate > 100) { // Update every 100ms
    matrixColumns.forEach(column => {
      column.y += column.speed;
      column.charIndex = (column.charIndex + 1) % column.chars.length;
      
      // Reset column when it goes off screen
      if (column.y > height + 100) {
        column.y = -100;
        column.speed = 2 + Math.random() * 8;
        // Randomize characters
        column.chars = Array.from({ length: 20 }, () => 
          matrixChars[Math.floor(Math.random() * matrixChars.length)]
        );
      }
    });
    matrixLastUpdate = currentTime;
  }
  
  // Draw matrix rain effect
  ctx.font = "18px monospace";
  ctx.textAlign = "center";
  
  matrixColumns.forEach(column => {
    const numCharsInColumn = 15;
    
    for (let i = 0; i < numCharsInColumn; i++) {
      const charY = column.y - (i * 20);
      if (charY < 0 || charY > height) continue;
      
      // Fade effect - brighter at the front, dimmer trailing
      const alpha = Math.max(0, 1 - (i / numCharsInColumn));
      const brightness = i === 0 ? 255 : Math.floor(255 * alpha * 0.7);
      
      ctx.fillStyle = `rgba(0, ${brightness}, 0, ${alpha})`;
      
      const charIndex = (column.charIndex + i) % column.chars.length;
      const char = column.chars[charIndex];
      
      ctx.fillText(char, column.x + 10, charY);
    }
  });
  
  // Add subtle green overlay for extra Matrix effect
  ctx.fillStyle = "rgba(0, 50, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);
};

const applyGameBoyFilter = (data: Uint8ClampedArray) => {
  // Classic Game Boy LCD color palette
  const palette = [
    { r: 15, g: 56, b: 15 },   // Dark green (darkest)
    { r: 48, g: 98, b: 48 },   // Medium dark green
    { r: 139, g: 172, b: 15 }, // Medium light green
    { r: 155, g: 188, b: 15 }  // Light green (brightest)
  ];

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Map grayscale to Game Boy palette (4 shades)
    let paletteIndex;
    if (gray < 64) paletteIndex = 0;
    else if (gray < 128) paletteIndex = 1;
    else if (gray < 192) paletteIndex = 2;
    else paletteIndex = 3;
    
    const color = palette[paletteIndex];
    data[i] = color.r;
    data[i + 1] = color.g;
    data[i + 2] = color.b;
    // Alpha stays the same
  }
};

const applyThermalFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale to determine "temperature"
    const intensity = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Map intensity to thermal colors (cold=blue to hot=red)
    let r, g, b;
    
    if (intensity < 64) {
      // Cold - Blue to Purple
      r = Math.floor(intensity * 2);
      g = 0;
      b = 255;
    } else if (intensity < 128) {
      // Cool - Purple to Black
      const factor = (intensity - 64) / 64;
      r = Math.floor(128 * factor);
      g = 0;
      b = Math.floor(255 * (1 - factor));
    } else if (intensity < 192) {
      // Warm - Black to Red
      const factor = (intensity - 128) / 64;
      r = Math.floor(255 * factor);
      g = 0;
      b = 0;
    } else {
      // Hot - Red to Yellow to White
      const factor = (intensity - 192) / 63;
      r = 255;
      g = Math.floor(255 * factor);
      b = Math.floor(100 * factor); // Slight blue for very hot
    }
    
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    // Alpha stays the same
  }
};

const applyVHSFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // Get the image data first
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply VHS color effects - reduce saturation and add color bleeding
  for (let i = 0; i < data.length; i += 4) {
    // Reduce saturation and add slight color shift
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Reduce overall saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    data[i] = Math.floor(r * 0.8 + gray * 0.2);     // Reduce red
    data[i + 1] = Math.floor(g * 0.9 + gray * 0.1); // Keep green stronger
    data[i + 2] = Math.floor(b * 0.7 + gray * 0.3); // Reduce blue more
    
    // Add slight noise
    const noise = (Math.random() - 0.5) * 20;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  
  // Put the modified image back
  ctx.putImageData(imageData, 0, 0);
  
  // Add horizontal tracking lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1;
  
  for (let y = 0; y < height; y += 4) {
    // Random slight offset for tracking lines
    const offset = Math.sin(y * 0.1) * 2;
    ctx.beginPath();
    ctx.moveTo(offset, y);
    ctx.lineTo(width + offset, y);
    ctx.stroke();
  }
  
  // Add subtle color bleeding effect
  ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
  ctx.fillRect(0, 0, width, height);
  
  // Add slight vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};