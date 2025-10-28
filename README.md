# Keepsake - Retro Apple PhotoBooth

A nostalgic photobooth web application that celebrates Apple's iconic design eras. Capture memories with real-time filters and authentic retro aesthetics! 📸✨

**[🚀 Try it Live](https://keepsake-nextjs.vercel.app)** | [GitHub](https://github.com/romanpaolo/keepsake-nextjs)

---

## Features

### 🎨 Three Iconic Apple Themes
- **Classic Mac (1984)**: Black & white pixel perfection with vintage aesthetics
- **Glamour Studio**: Translucent, luxe design with champagne glow
- **Mac OS X Aqua**: Modern OS X design with refined controls

### 📸 Photo Modes
- **Single Shot**: One perfect photo with countdown timer
- **Burst Mode**: 3 rapid-fire photos in succession
- **Photo Strip**: Classic 4-photo film strip with "Get Ready" messages

### 🎭 Premium Retro Filters
- **35mm Film**: Warm, nostalgic film stock look
- **Vintage Sepia**: Classic vintage photobooth tone
- **B&W Minimal**: High-contrast black & white
- **B&W V3**: Extreme contrast for dramatic effect
- **Kodak Film**: Warm nostalgic film aesthetic
- **Kodak Portra 400**: Soft, creamy skin tones with pastel quality

### ✨ Key Features
- **Real-time filter preview** - See filters applied before you capture
- **Authentic film strip export** - Black borders with edge blur effects
- **Smart countdown** - "Get Ready for Photo X" message in strip mode
- **White flash animation** - Camera flash effect on capture
- **Theme-specific UI** - Authentic retro styling for each era
- **Download options** - Save individual photos or complete film strips
- **Sound effects** - Countdown beeps, camera shutter, flash sounds
- **WYSIWYG capture** - What you see is what you get
- **Privacy-first** - All processing happens locally, no uploads

---

## Quick Start

### Online (No Installation)
Simply visit **[keepsake-nextjs.vercel.app](https://keepsake-nextjs.vercel.app)** in your browser!

### Local Development

**Requirements:**
- Node.js 18+
- A webcam/camera
- Modern browser (Chrome, Firefox, Safari, Edge)

```bash
# Clone the repository
git clone https://github.com/romanpaolo/keepsake-nextjs.git
cd keepsake-nextjs

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build
```bash
npm run build
npm run start
```

---

## How to Use

1. **Allow Camera Access** - Grant permission when prompted
2. **Choose Theme** - Select from Classic Mac, Glamour Studio, or Aqua
3. **Pick Photo Mode** - Single, Burst, or Strip mode
4. **Select Filter** - Choose from 6 premium retro filters
5. **Capture** - Hit the button and pose during the countdown
   - **Single/Burst**: 3-second countdown then capture
   - **Strip**: "Get Ready" message + countdown for each of 4 photos
6. **Download** - Save individual photos or complete film strips

---

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **WebRTC API** - Browser camera access
- **Canvas API** - Real-time image processing
- **Web Audio API** - Sound effects

---

## Project Architecture

```
app/
├── globals.css              # Theme styling
├── layout.tsx               # Root layout
└── page.tsx                 # Main page

components/
├── PhotoBoothApp.tsx        # Main container & state
├── FilteredCameraView.tsx   # Real-time camera feed
├── ControlPanel.tsx         # Photo modes & filters
├── PhotoStrip.tsx           # Gallery & export
├── CountdownOverlay.tsx     # Timer display
└── ThemeSelector.tsx        # Theme selection

hooks/
├── useCamera.ts             # WebRTC camera
└── useCountdown.ts          # Countdown timer

lib/
├── types.ts                 # TypeScript types
├── filters.ts               # All filter functions
└── utils.ts                 # Utilities (export, download, sounds)
```

---

## Development Guide

### Adding New Filters
1. Add filter type to `PhotoFilter` in `lib/types.ts`
2. Implement filter function in `lib/filters.ts`
3. Add to control panel in `ControlPanel.tsx`

### Customizing Themes
1. Update colors in `tailwind.config.ts`
2. Modify CSS in `app/globals.css`
3. Update component logic for theme handling

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full (HTTPS required in production) |
| Mobile | ✅ Responsive design |

---

## Privacy & Security

🔒 **Your privacy is protected:**
- All photos processed **locally in your browser**
- **No uploads** to any server
- **No tracking** or analytics
- **No data storage** - everything stays on your device
- Camera access only when you grant permission

---

## Performance

- **30fps+** real-time filtering on modern devices
- **Async operations** for smooth UI
- **Client-side processing** with no network latency
- **Optimized canvas** operations using requestAnimationFrame

---

## Known Limitations

- Some filters may perform slower on older devices
- Camera requires HTTPS in production (localhost is fine)
- Photo quality depends on device screen resolution
- Mobile camera permissions vary by device

---

## Future Ideas

- [ ] More Apple themes (Newton, iPod, MacBook)
- [ ] Custom frames and borders
- [ ] GIF creation from burst mode
- [ ] Social sharing integration
- [ ] Video recording support
- [ ] More vintage filters
- [ ] Easter eggs and surprises

---

## Contributing

This is a passion project celebrating Apple's design heritage. Feel free to fork, modify, and share!

## License

Educational and nostalgic use. Apple, Macintosh, iMac, and Mac OS are trademarks of Apple Inc.

---

**Capture your memories in retro style!** 📸✨

Made with ❤️ for Apple design history enthusiasts
