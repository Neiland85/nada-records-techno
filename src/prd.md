# Nada Records - Techno Store PRD

## Core Purpose & Success

**Mission Statement**: Create a premium digital techno music store featuring Neiland's original compositions with high-quality audio previews, multiple format downloads, and seamless user experience.

**Success Indicators**: User engagement through audio previews, successful track purchases, user account creation and retention, and smooth audio streaming without interruptions.

**Experience Qualities**: Professional, Immersive, Cutting-edge

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with basic state)
**Primary User Activity**: Consuming and Acting (listening to previews, purchasing tracks)

## Audio Preview System

### Core Audio Features
- **Real-time Audio Streaming**: Instant playback of track previews with loading states
- **Global Playback Control**: Only one track plays at a time across the entire application
- **Mini Player**: Floating player widget when track is playing with progress control
- **Volume Control**: User-adjustable volume with visual feedback
- **Seek Control**: Ability to scrub through track timeline
- **Loading States**: Visual feedback during audio loading and buffering

### Audio Player Architecture
- **useAudioPlayer Hook**: Custom React hook managing individual audio instances
- **AudioPlayerContext**: Global state management for playback control
- **AudioPreview Component**: Reusable component for track preview buttons
- **Floating Mini Player**: Persistent playback control when tracks are playing

## Essential Features

### Audio System
- **Instant Preview**: Click-to-play functionality on track cards
- **Progress Tracking**: Real-time progress display with seek capability
- **Volume Management**: Individual volume control with mute functionality
- **Auto-stop**: Automatic stopping of previous track when new one starts
- **Error Handling**: Graceful fallback when audio files are unavailable

### Track Management
- **Multi-format Support**: MP3, WAV, FLAC download options
- **Quality Selection**: Different bitrates and file sizes per format
- **Price Differentiation**: Format-based pricing structure
- **Cart System**: Add tracks to cart with format selection

### User Interface
- **Responsive Design**: Works across desktop, tablet, and mobile
- **3D Button Effects**: Modern interactive button styling
- **Glassmorphism**: Contemporary visual effects
- **Dark Theme**: Professional dark color scheme optimized for music

## Design Direction

### Visual Tone & Identity
**Emotional Response**: The design should evoke sophistication, energy, and underground techno culture
**Design Personality**: Cutting-edge, professional, slightly futuristic with industrial undertones
**Visual Metaphors**: Digital waveforms, electronic circuits, underground club aesthetics
**Simplicity Spectrum**: Minimal interface with rich audio interaction

### Color Strategy
**Color Scheme Type**: Monochromatic dark theme with electric accent colors
**Primary Color**: Deep electric blue (oklch(0.65 0.25 240)) - represents electronic music energy
**Secondary Colors**: Warm yellow (oklch(0.70 0.15 60)) - for CTAs and highlights
**Accent Color**: Cyan blue (oklch(0.80 0.20 200)) - for audio controls and focus states
**Color Psychology**: Dark backgrounds convey professionalism and focus, while electric accents suggest energy and innovation

### Typography System
**Font Pairing Strategy**: Inter font family for clean, modern readability
**Typographic Hierarchy**: Clear distinction between track titles, artist names, and metadata
**Font Personality**: Clean, contemporary, tech-focused
**Typography Consistency**: Consistent spacing and sizing throughout the interface

### Audio Player UI Elements
**Play/Pause Controls**: Large, prominent circular buttons with 3D effects
**Progress Bars**: Sleek sliders with smooth transitions
**Volume Controls**: Compact horizontal sliders with speaker icons
**Time Display**: Monospace-style time formatting for precision
**Loading States**: Subtle spinning indicators matching the color scheme

### Component Design
**Track Cards**: Hover-revealed play buttons with cover art focus
**Mini Player**: Floating card with glassmorphism effects
**Audio Controls**: Tactile buttons with immediate visual feedback
**Format Selection**: Clean tabbed interface for quality options

## Audio File Management

### File Structure
- Audio files stored in `/public/audio/` directory
- Consistent naming convention matching track IDs
- Multiple format support planned (currently MP3 focused)
- Fallback handling for missing files

### Technical Requirements
- Web Audio API compatibility
- Responsive audio loading
- Memory management for multiple tracks
- Cross-browser audio support
- Mobile audio playback optimization

## Edge Cases & Error Handling

**Audio Loading Failures**: Graceful degradation with user feedback
**Network Issues**: Buffering indicators and retry mechanisms
**Mobile Playback**: iOS/Android audio policy compliance
**Browser Compatibility**: Fallback for older browsers
**File Size Management**: Optimized loading for different connection speeds

## Implementation Status

✅ **Completed Features**:
- Audio preview system with play/pause controls
- Global playback management
- Floating mini player with progress control
- Volume control and seeking
- Loading states and error handling
- Responsive track cards with audio integration

🔄 **In Progress**:
- Audio file optimization
- Mobile playback testing

📋 **Planned Enhancements**:
- Waveform visualization
- Keyboard shortcuts for audio control
- Playlist functionality
- Audio quality selection

## Video Thumbnail Generation System

### Core Video Features
- **Timestamp-based Capture**: Extract frames from videos at specific timestamps
- **Auto-generation**: Automatically create thumbnail grids from video content
- **Custom Timestamps**: User-defined timestamp input for precise frame capture
- **Preview Integration**: Generated thumbnails integrate with video player controls
- **Download Support**: Individual and batch download of generated thumbnails

### Video Thumbnail Architecture
- **VideoThumbnailGenerator Component**: Modal-based thumbnail generation interface
- **Canvas-based Capture**: HTML5 Canvas API for frame extraction
- **Real-time Preview**: Live video scrubbing with immediate thumbnail generation
- **Persistent Storage**: Generated thumbnails saved with video clip metadata
- **Responsive Gallery**: Grid-based thumbnail display with hover interactions

### Thumbnail Features
- **Multiple Generation Methods**:
  - Current timestamp capture
  - Auto-generation (6 evenly spaced thumbnails)
  - Custom timestamp batch generation
- **Quality Control**: JPEG compression with 80% quality for optimal file size
- **File Naming**: Systematic naming with timestamp and track information
- **Timestamp Navigation**: Click thumbnails to seek video to corresponding time
- **Visual Feedback**: Hover effects and timestamp badges on thumbnails

### Integration with Video Clips Banner
- **Conditional Display**: Thumbnail generator only appears when video is uploaded
- **Generated Thumbnails Gallery**: Display of all generated thumbnails below video player
- **Seamless Workflow**: Generate thumbnails directly from video player interface
- **Persistent Data**: Thumbnails saved in video clip metadata for future sessions