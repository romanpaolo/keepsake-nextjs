export type AppleTheme = "classic" | "imac" | "aqua";

export type PhotoMode = "single" | "burst" | "strip";

export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
  theme: AppleTheme;
  filter?: PhotoFilter;
}

export type PhotoFilter =
  | "none"
  | "35mm-film"
  | "vintage-sepia"
  | "bw-minimal"
  | "bw-v3"
  | "kodak-film"
  | "kodak-portra";

export interface CameraSettings {
  width: number;
  height: number;
  facingMode: "user" | "environment";
}

export interface PhotoStripLayout {
  photos: Photo[];
  theme: AppleTheme;
  timestamp: number;
}