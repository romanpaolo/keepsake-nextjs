# Keepsake - Retro Apple PhotoBooth

A nostalgic photobooth web application that celebrates Apple's iconic design eras, from the classic Macintosh to the colorful iMac G3 and the revolutionary Mac OS X Aqua interface. Capture memories in authentic retro style!

## Features

### 🎨 Three Iconic Apple Themes
- **Classic Mac (1984)**: Black & white pixel perfection with Chicago font and vintage aesthetics
- **Glamour Studio (iMac G3 inspired)**: Translucent, luxe design with champagne glow
- **Mac OS X Aqua (2001)**: Modern OS X design with refined controls

### 📸 Photo Modes
- **Single Shot**: Take one perfect photo with countdown
- **Burst Mode**: Capture 3 photos in rapid succession
- **Photo Strip**: Classic 4-photo strip format with "Get Ready" messages between shots

### 🎭 Premium Retro Filters
- **35mm Film**: Warm, nostalgic film stock look
- **Vintage Sepia**: Classic vintage photobooth tone
- **B&W Minimal**: High-contrast black & white
- **B&W V3**: Extreme contrast for dramatic effect
- **Kodak Film**: Warm nostalgic film aesthetic
- **Kodak Portra 400**: Soft, creamy skin tones with pastel quality

### ✨ Enhanced Features
- **Real-time filter preview**: See filters applied to your camera feed before taking photos
- **Authentic photo strip export**: Black borders with edge blur/bleed effects for printed film look
- **Smart countdown**: "Get Ready for Photo X" message before each shot in strip mode
- **White flash animation**: Camera flash effect when capturing
- **Theme-specific styling**: Authentic retro UI for each era
- **Individual & strip downloads**: Save single photos or complete film strips
- **Authentic retro sound effects**: Countdown beeps, camera shutter, flash sounds
- **WYSIWYG capture**: What you see in preview is exactly what you get
- **Responsive design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A webcam/camera connected to your device
- Modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/keepsake-nextjs.git
cd keepsake-nextjs
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
2. **Choose Your Era**: Select from Classic Mac, Glamour Studio, or Aqua themes
3. **Select Photo Mode**: Choose between single, burst, or strip modes
4. **Apply Filters**: Pick from various premium retro filters to enhance your photos
5. **Take Photos**: Click the capture button and strike a pose during the countdown
   - Single/Burst: One countdown then capture
   - Strip: "Get Ready" message + countdown for each of 4 photos
6. **Download**: Save individual photos or create an authentic film strip with black borders

## Technical Details

### Built With
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **WebRTC API**: Browser camera access
- **Canvas API**: Real-time image processing and filters
- **Web Audio API**: Sound effects generation

### Key Components
- `PhotoBoothApp`: Main application logic and state management
- `FilteredCameraView`: Real-time camera feed with live filter preview
- `ControlPanel`: Photo modes and filter selection
- `PhotoStrip`: Gallery display with film strip export
- `CountdownOverlay`: Timer display with "Get Ready" messages
- `ThemeSelector`: Apple era selection interface

### Custom Hooks
- `useCamera`: WebRTC camera management with permission handling
- `useCountdown`: Enhanced timer with photo number display and "Get Ready" messages

### Filter System
- Real-time optimized canvas-based filtering
- Tone curves for authentic film looks
- Vibrance and saturation boosts
- Color grading and warmth adjustments
- Edge blur effects on exported photos

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (requires HTTPS in production)
- ✅ Mobile browsers: Supported with responsive design

## Privacy & Security

This application:
- Processes all photos **locally in your browser**
- Does **not** upload or store any images on servers
- Only accesses your camera when you grant permission
- All data stays entirely on your device
- No tracking or analytics

## Project Structure

```
app/
├── globals.css           # Theme and component styling
├── layout.tsx            # Root layout
└── page.tsx              # Main page

components/
├── PhotoBoothApp.tsx     # Main application container
├── FilteredCameraView.tsx# Real-time camera with filters
├── ControlPanel.tsx      # Mode and filter selection
├── PhotoStrip.tsx        # Photo gallery and export
├── CountdownOverlay.tsx  # Timer display
└── ThemeSelector.tsx     # Theme selection

hooks/
├── useCamera.ts          # WebRTC camera management
└── useCountdown.ts       # Countdown timer logic

lib/
├── types.ts              # TypeScript definitions
├── filters.ts            # All filter implementations
└── utils.ts              # Utility functions (photo strip generation, downloads, sounds)
```

## Development

### Adding New Filters
1. Add filter type to `PhotoFilter` union in `lib/types.ts`
2. Implement filter function in `lib/filters.ts`
3. Add to filter selection in `ControlPanel.tsx`

### Customizing Themes
1. Update theme colors in `tailwind.config.ts`
2. Modify theme-specific styles in `app/globals.css`
3. Adjust component logic in theme-aware components

## Performance Tips

- Real-time filtering is optimized for 30fps+ on modern devices
- Canvas operations use requestAnimationFrame for smooth playback
- Photo strip generation is async to prevent UI blocking
- All processing happens client-side (no network overhead)

## Known Limitations

- Some filters may be less performant on older devices
- Camera requires HTTPS in production (except localhost)
- Photo strip export quality depends on device screen resolution
- Mobile devices may have varying camera access permissions

## Future Enhancements

- [ ] Add more Apple themes (Newton, iPod, MacBook)
- [ ] Custom photo frames and borders
- [ ] GIF creation from burst mode
- [ ] Social media sharing
- [ ] Audio/video recording
- [ ] More vintage filters
- [ ] Easter eggs and hidden features

## Contributing

Feel free to fork, modify, and share! This is a passion project celebrating Apple's design heritage.

## License

This project is for educational and nostalgic purposes. Apple, Macintosh, iMac, and Mac OS are trademarks of Apple Inc.

---

**Made with ❤️ for Apple design history enthusiasts**

Capture your memories in retro style! 📸✨
