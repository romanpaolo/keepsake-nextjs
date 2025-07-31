# Retro Apple PhotoBooth

A nostalgic photobooth web application that celebrates Apple's iconic design eras, from the classic Macintosh to the colorful iMac G3 and the revolutionary Mac OS X Aqua interface.

## Features

### 🎨 Three Iconic Apple Themes
- **Classic Mac (1984)**: Black & white pixel perfection with Chicago font and dithering effects
- **iMac G3 (1998)**: Translucent, colorful design with Bondi Blue aesthetics
- **Mac OS X Aqua (2001)**: Gel buttons, brushed metal, and pinstripe backgrounds

### 📸 Photo Modes
- **Single Shot**: Take one perfect photo
- **Burst Mode**: Capture 3 photos in quick succession
- **Photo Strip**: Classic 4-photo strip format

### 🎭 Retro Filters
- **Dither**: Classic Mac 1-bit graphics
- **CRT**: Old monitor effect with scanlines
- **Sepia**: Vintage photo tone
- **ASCII**: Text-based art conversion
- **Pixelate**: 8-bit retro gaming style
- **Scanlines**: TV/monitor effect
- **Matrix**: Green digital rain with falling characters (like Neo in The Matrix!)

### ✨ Additional Features
- **Real-time filter preview**: See filters applied to your camera feed before taking photos
- Theme-specific styling and effects
- Countdown timer with sound effects
- Flash animation when capturing
- Download individual photos or photo strips
- Authentic retro sound effects
- Responsive design for all devices
- WYSIWYG (What You See Is What You Get) photo capture

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A webcam/camera connected to your device
- Modern web browser with WebRTC support

### Installation

1. Clone the repository:
```bash
cd retro-apple-photobooth
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## Usage

1. **Allow Camera Access**: Click "Allow Camera Access" when prompted
2. **Choose Your Era**: Select from Classic Mac, iMac G3, or Mac OS X themes
3. **Select Photo Mode**: Choose between single, burst, or strip modes
4. **Apply Filters**: Pick from various retro filters to enhance your photos
5. **Take Photos**: Click the capture button and strike a pose during the countdown
6. **Download**: Save individual photos or create a photo strip

## Technical Details

### Built With
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **WebRTC API**: Browser camera access
- **Canvas API**: Image processing and filters
- **Web Audio API**: Sound effects generation

### Key Components
- `PhotoBoothApp`: Main application logic and state management
- `CameraView`: WebRTC video display with theme styling
- `ControlPanel`: Photo modes and filter selection
- `PhotoStrip`: Gallery display and download functionality
- `ThemeSelector`: Apple era selection interface

### Custom Hooks
- `useCamera`: WebRTC camera management
- `useCountdown`: Timer functionality with callbacks

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (requires HTTPS in production)
- Mobile browsers: Supported with responsive design

## Privacy

This application:
- Processes all photos locally in your browser
- Does not upload or store any images on servers
- Only accesses your camera when you grant permission
- All data stays on your device

## Future Enhancements

- [ ] Add more classic Apple themes (Newton, iPod, etc.)
- [ ] Custom photo frames and borders
- [ ] Social sharing integration
- [ ] GIF creation from burst mode
- [ ] More authentic fonts (Chicago, Charcoal, etc.)
- [ ] Classic Mac startup chime easter egg

## License

This project is for educational and nostalgic purposes. Apple, Macintosh, iMac, and Mac OS are trademarks of Apple Inc.

---

Made with ❤️ for Apple design history enthusiasts