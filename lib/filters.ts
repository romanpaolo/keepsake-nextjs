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
    case "35mm-film":
      apply35mmFilmFilter(data, canvas.width, canvas.height);
      break;
    case "vintage-sepia":
      applyVintageSepiaFilter(data, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      addSubtleTexture(ctx, canvas.width, canvas.height);
      return; // Early return since we already put image data
    case "bw-minimal":
      applyBWMinimalFilter(data);
      break;
    case "bw-v3":
      applyBWV3Filter(data);
      break;
    case "kodak-film":
      applyKodakFilmFilter(data);
      break;
    case "kodak-portra":
      applyKodakPortraFilter(data);
      break;
    case "none":
    default:
      return;
  }

  ctx.putImageData(imageData, 0, 0);
};

// 35mm Film Filter
// Based on: Exposure -0.47, Contrast +40, Highlights +23, Shadows -15
// Clarity -19, Vibrance +13, warm tone
const apply35mmFilmFilter = (data: Uint8ClampedArray, width: number, height: number) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Reduce exposure slightly
    r *= 0.85;
    g *= 0.85;
    b *= 0.85;

    // Warm tone (add warmth, reduce blue/cyan)
    r *= 1.12;
    g *= 1.03;
    b *= 0.92;

    // Increase contrast
    r = ((r / 255 - 0.5) * 1.4 + 0.5) * 255;
    g = ((g / 255 - 0.5) * 1.4 + 0.5) * 255;
    b = ((b / 255 - 0.5) * 1.4 + 0.5) * 255;

    // Boost vibrance (enhance mid-tones)
    const avg = (r + g + b) / 3;
    const saturationBoost = 1.13;
    r = avg + (r - avg) * saturationBoost;
    g = avg + (g - avg) * saturationBoost;
    b = avg + (b - avg) * saturationBoost;

    // Apply tone curve (lift shadows, compress highlights)
    r = applyToneCurve(r, [
      [0, 0], [59, 62], [130, 127], [195, 197], [227, 228], [255, 255]
    ]);
    g = applyToneCurve(g, [
      [0, 0], [59, 62], [130, 127], [195, 197], [227, 228], [255, 255]
    ]);
    b = applyToneCurve(b, [
      [0, 0], [59, 62], [130, 127], [195, 197], [227, 228], [255, 255]
    ]);

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
};

// Vintage Photobooth Filter
// Subtle brown-gray tone - mostly desaturated (90% grayscale)
// Muted and understated, NOT orange or heavily sepia
// Just a hint of warm undertone
const applyVintageSepiaFilter = (data: Uint8ClampedArray, width: number, height: number) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Convert to grayscale
    const gray = r * 0.299 + g * 0.587 + b * 0.114;

    // 2. Apply contrast
    let adjusted = ((gray / 255 - 0.5) * 1.15 + 0.5) * 255;

    // Lift blacks slightly for matte feel
    if (adjusted < 40) {
      adjusted = adjusted * 0.8 + 10;
    }

    adjusted = Math.max(0, Math.min(255, adjusted));

    // 3. VERY SUBTLE brown-gray tone (not orange!)
    r = adjusted * 1.04;  // Barely any red boost (2%)
    g = adjusted * 0.99;  // Slight green reduction (2%)
    b = adjusted * 0.92;  // Modest blue reduction (6%)

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
};

// B&W Minimal Filter
// Based on: High contrast B&W, Exposure -0.15, Contrast +47
// Highlights -64, Clarity +16
const applyBWMinimalFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to grayscale with custom weighting
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Reduce exposure
    gray *= 0.85;

    // Increase contrast significantly
    gray = ((gray / 255 - 0.5) * 1.47 + 0.5) * 255;

    // Crush highlights (compress bright areas)
    if (gray > 180) {
      gray = 180 + (gray - 180) * 0.5;
    }

    // Add clarity (micro-contrast)
    const clarity = 1.16;
    gray = ((gray / 255 - 0.5) * clarity + 0.5) * 255;

    const final = Math.max(0, Math.min(255, gray));
    data[i] = final;
    data[i + 1] = final;
    data[i + 2] = final;
  }
};

// B&W V3 Filter
// Based on: Extreme contrast B&W, Exposure -0.27, Contrast +69
// Highlights -81, Shadows +53, Clarity +34
const applyBWV3Filter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to grayscale
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Reduce exposure
    gray *= 0.73;

    // Extreme contrast
    gray = ((gray / 255 - 0.5) * 1.69 + 0.5) * 255;

    // Lift shadows significantly
    if (gray < 100) {
      gray = gray + (100 - gray) * 0.53;
    }

    // Crush highlights dramatically
    if (gray > 170) {
      gray = 170 + (gray - 170) * 0.3;
    }

    // Add strong clarity
    const clarity = 1.34;
    gray = ((gray / 255 - 0.5) * clarity + 0.5) * 255;

    const final = Math.max(0, Math.min(255, gray));
    data[i] = final;
    data[i + 1] = final;
    data[i + 2] = final;
  }
};

// Kodak Film Filter
// Based on: Warm nostalgic film look, Exposure +0.25, Contrast +15
// Vibrance +22, Saturation +10, warm color grading
const applyKodakFilmFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Increase exposure
    r *= 1.25;
    g *= 1.25;
    b *= 1.25;

    // Add warm Kodak color cast
    r *= 1.15;
    g *= 1.05;
    b *= 0.93;

    // Increase contrast moderately
    r = ((r / 255 - 0.5) * 1.15 + 0.5) * 255;
    g = ((g / 255 - 0.5) * 1.15 + 0.5) * 255;
    b = ((b / 255 - 0.5) * 1.15 + 0.5) * 255;

    // Boost vibrance and saturation
    const avg = (r + g + b) / 3;
    const vibranceBoost = 1.22;
    r = avg + (r - avg) * vibranceBoost * 1.10;
    g = avg + (g - avg) * vibranceBoost * 1.10;
    b = avg + (b - avg) * vibranceBoost * 1.10;

    // Kodak signature warm midtone shift
    const luminance = (r + g + b) / 3 / 255;
    if (luminance > 0.3 && luminance < 0.7) {
      r *= 1.08;
      g *= 1.03;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
};

// Kodak Portra 400 Filter
// Based on: Soft, creamy skin tones, Exposure +0.12, Contrast -5
// Highlights -22, Shadows +18, Vibrance +25, soft pastel look
const applyKodakPortraFilter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Slight exposure boost
    r *= 1.12;
    g *= 1.12;
    b *= 1.12;

    // Reduce contrast for soft look
    r = ((r / 255 - 0.5) * 0.95 + 0.5) * 255;
    g = ((g / 255 - 0.5) * 0.95 + 0.5) * 255;
    b = ((b / 255 - 0.5) * 0.95 + 0.5) * 255;

    // Portra's signature creamy warmth
    r *= 1.08;
    g *= 1.04;
    b *= 0.97;

    // Lift shadows (open up dark areas)
    const luminance = (r + g + b) / 3;
    if (luminance < 100) {
      const lift = 1.18;
      r *= lift;
      g *= lift;
      b *= lift;
    }

    // Pull down highlights (soft, not blown out)
    if (luminance > 180) {
      const compress = 0.85;
      r *= compress;
      g *= compress;
      b *= compress;
    }

    // Boost vibrance for pastel quality
    const avg = (r + g + b) / 3;
    const vibranceBoost = 1.25;
    r = avg + (r - avg) * vibranceBoost;
    g = avg + (g - avg) * vibranceBoost;
    b = avg + (b - avg) * vibranceBoost;

    // Portra green-magenta shift
    g *= 1.02;

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
};

// Helper: Apply tone curve
const applyToneCurve = (value: number, curve: number[][]): number => {
  const normalized = value / 255;

  // Find the two points to interpolate between
  for (let i = 0; i < curve.length - 1; i++) {
    const [x1, y1] = curve[i];
    const [x2, y2] = curve[i + 1];

    const nx1 = x1 / 255;
    const nx2 = x2 / 255;

    if (normalized >= nx1 && normalized <= nx2) {
      // Linear interpolation
      const t = (normalized - nx1) / (nx2 - nx1);
      const ny1 = y1 / 255;
      const ny2 = y2 / 255;
      const result = ny1 + t * (ny2 - ny1);
      return result * 255;
    }
  }

  return value;
};

// Add vignette effect
const addVignette = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const vignette = 1 - (dist / maxDist) * amount;

      data[idx] *= vignette;
      data[idx + 1] *= vignette;
      data[idx + 2] *= vignette;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

// Add film grain
const addGrain = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const grainStrength = amount / 100;

  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * grainStrength * 50;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }

  ctx.putImageData(imageData, 0, 0);
};

// Vintage Photobooth Effects

// Add warm brown overlay for extra vintage feel
const addWarmOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = 'rgba(160, 130, 90, 0.15)'; // Brown overlay
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
};

// Add subtle texture overlay (clean, minimal grain - no heavy effects)
const addSubtleTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply very subtle noise using overlay blend mode
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.02;

  // Create minimal noise pattern
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = 255;
  }

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (tempCtx) {
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0);
  }

  // Reset composite operation and alpha
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
};

// CRT and Scanlines effects (kept for compatibility)
export const addCRTEffect = (canvas: HTMLCanvasElement): void => {
  // CRT not used in Keepsake presets but keeping for potential future use
};

export const addScanlines = (canvas: HTMLCanvasElement): void => {
  // Scanlines not used in Keepsake presets but keeping for potential future use
};
