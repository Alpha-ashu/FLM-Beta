# App Assets

This folder contains the source assets for app icons and splash screens.

## Required Files

### icon.png
- **Size**: 1024 x 1024 pixels
- **Format**: PNG with transparency
- **Purpose**: Source for all app icons (Android, iOS, PWA)
- **Background**: Transparent or solid color
- **Content**: App logo/icon centered

### splash.png
- **Size**: 2732 x 2732 pixels
- **Format**: PNG
- **Purpose**: Source for splash screens
- **Background**: Solid color matching app theme (#ffffff)
- **Content**: App logo centered, minimal text

## Generation
After placing the source files, run:
```bash
npx capacitor-assets generate
npx cap sync
```

This will generate all required icon and splash screen variants for Android and iOS.

## Notes
- Ensure high-quality, scalable vector graphics for best results
- Test generated assets on various device sizes
- Icons should be recognizable at small sizes (48x48)
- Splash screens should load quickly