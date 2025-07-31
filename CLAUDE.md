# CLAUDE.md - Retro Apple PhotoBooth

This file provides guidance to Claude Code when working with this retro Apple-themed photobooth application.

## Project Overview

A nostalgic photobooth web application that celebrates Apple's iconic design eras with real-time camera filtering and authentic retro aesthetics.

## Architecture

### Component Structure
- `PhotoBoothApp.tsx` - Main application container with state management
- `FilteredCameraView.tsx` - Real-time camera feed with live filter preview
- `ThemeSelector.tsx` - Apple era selection interface
- `ControlPanel.tsx` - Photo modes and filter controls
- `PhotoStrip.tsx` - Photo gallery and download functionality
- `CountdownOverlay.tsx` - Timer display during photo capture

### Key Features
- **Real-time Filter Preview**: Canvas-based filtering applied to live camera feed
- **WYSIWYG Photo Capture**: What you see in preview is exactly what gets captured
- **Single Filter Application**: No filter stacking - only one filter active at a time
- **Theme-Specific Effects**: CSS-based effects that complement but don't conflict with filters

### Filter System (`lib/filters.ts`)
- Floyd-Steinberg dithering for classic Mac aesthetic
- Real-time optimized algorithms
- Bounds checking to prevent array overflows
- Canvas-based processing for performance

### Camera Integration (`hooks/useCamera.ts`)
- WebRTC camera access with permission handling
- Stream management and cleanup
- Error handling for various camera scenarios

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Key Implementation Details

### Real-time Filtering
The `FilteredCameraView` component uses `requestAnimationFrame` to continuously:
1. Draw video frames to a hidden canvas
2. Apply selected filter processing
3. Display the filtered result
4. Handle cleanup on component unmount

### Filter Application Logic
```typescript
// Only one filter is applied at a time
if (selectedFilter !== "none") {
  applyFilter(canvas, selectedFilter);
}

// Special effect filters get additional processing
if (selectedFilter === "crt") {
  addCRTEffect(canvas);
}
```

### Performance Optimizations
- Canvas reuse to avoid memory allocation
- Bounds checking in filter algorithms
- Optimized dithering with error diffusion
- Efficient pixelation using canvas scaling

### Theme System
Three distinct Apple eras with authentic styling:
- **Classic Mac (1984)**: Black & white, pixel-perfect, CRT effects
- **iMac G3 (1998)**: Translucent colors, rounded corners, Bondi Blue
- **Mac OS X Aqua (2001)**: Gel buttons, brushed metal, traffic lights

## Common Development Tasks

### Adding New Filters
1. Add filter type to `PhotoFilter` union in `lib/types.ts`
2. Implement filter function in `lib/filters.ts`
3. Update filter application logic in `FilteredCameraView.tsx`
4. Add filter option to control panel

### Modifying Themes
1. Update theme colors in `tailwind.config.ts`
2. Modify theme-specific CSS classes in `globals.css`
3. Update component styling logic for new theme

### Performance Tuning
- Monitor frame rate during filter preview
- Adjust filter algorithms for real-time performance
- Consider reduced resolution for computationally expensive filters

## Browser Compatibility

### WebRTC Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Requires HTTPS in production
- Mobile: Supported with responsive design

### Camera Permissions
- Graceful permission handling
- Clear error messages for denied access
- Fallback UI when camera unavailable

## Security & Privacy

- All processing happens client-side
- No data sent to servers
- Camera access only when user grants permission
- Local storage for temporary photo data

## Known Limitations

- Real-time dithering can be CPU intensive on older devices
- ASCII filter may need font size adjustment for different screen sizes
- Some filters work better with good lighting conditions

## Future Enhancements

- WebGL shaders for more complex effects
- Custom photo frames and borders
- GIF creation from burst mode
- Social sharing integration
- More authentic retro fonts

---

*Focus on maintaining the authentic retro aesthetic while ensuring modern web performance and accessibility.*