# PRD: Image Metadata Removal Tool

## Product Overview
A privacy-focused web application that removes EXIF and related metadata from user-uploaded images. The product builds trust through storytelling, then delivers simple, effective metadata removal.

## Target Users
Privacy-conscious individuals who want to share images online without exposing hidden metadata (location, device info, timestamps).

## User Journey

### 1. Marketing Experience (Scroll-Driven Storytelling)
Five sequential scenes that scroll-animate on the landing page:

1. **Upload** — Visual of image upload interface
2. **Hidden Data** — Visualization of metadata embedded in images (GPS, camera model, timestamps)
3. **Risk** — Show privacy/security implications of exposed metadata
4. **Solution** — Product removes metadata automatically
5. **Safe Share** — Clean image ready to share + premium CTA button

Each scene pairs visuals with concise explanatory text.

### 2. Application Experience
After clicking CTA, users access the tool:

**Upload**
- Drag-and-drop or click to upload
- Supports single or multiple images
- Accepts common formats: JPG, PNG, HEIC, WebP

**Analysis**
- System scans uploaded images
- Displays metadata found in each image (grouped by category: Location, Device, Timestamps, Camera Settings, Other)

**Removal**
- One-click "Remove All Metadata" action
- Shows before/after comparison per image
- Clear indicator of what was removed

**Download**
- Download individual cleaned images
- Download all as ZIP (batch)
- Original filenames preserved with optional "-clean" suffix

## Core Features

### Must Have
- Multi-image upload (drag-and-drop)
- Metadata detection and display
- Complete metadata removal
- Before/after metadata comparison view
- Single and batch download
- Scroll-driven storytelling hero section

### Won't Have (Scope Exclusions)
- Selective metadata removal (all or nothing)
- Cloud storage integration
- Image history/accounts
- Image editing features
- File format conversion
- Server-side storage (process and delete immediately)

## Privacy & Security Principles
- Client-side processing preferred where feasible
- If server-side processing required: immediate deletion after download
- No logging of image content or metadata
- No user accounts required
- Clear privacy policy linked in footer

## Success Metrics
- Conversion rate from storytelling to CTA click
- Images processed per session
- User completion rate (upload → download)
- Time on storytelling section

## Technical Constraints
- File size limit: 20MB per image
- Processing time target: <3 seconds per image
- Support modern browsers (Chrome, Firefox, Safari, Edge)

## Out of Scope
- Mobile apps
- API access
- Paid tiers or pricing model details
- User authentication
- Advanced image analysis features