# Design & UX Specification

## Visual Identity

### Color Palette

**Light Mode**
- **Primary**: Slate Blue `#4A5568` — Trust, professionalism
- **Accent**: Soft Teal `#2C7A7B` — Security, calm action
- **Background**: Warm White `#FAFAF9` — Clean, premium
- **Text Primary**: Charcoal `#1A202C`
- **Text Secondary**: Medium Gray `#718096`
- **Success**: Muted Green `#38A169` — Safe outcome
- **Surface**: Light Gray `#F7FAFC` — Cards, panels

**Dark Mode**
- **Primary**: Soft Periwinkle `#A3BFFA` — Approachable trust
- **Accent**: Aqua Glow `#4FD1C5` — Security highlight
- **Background**: Deep Charcoal `#0F172A` — Premium depth
- **Text Primary**: Off-White `#F1F5F9`
- **Text Secondary**: Cool Gray `#94A3B8`
- **Success**: Sage Green `#68D391` — Safe outcome
- **Surface**: Slate `#1E293B` — Elevated elements

### Typography

**Headings**: Inter or Geist (geometric, modern, trustworthy)  
**Body**: System font stack (native, fast, accessible)  
**Monospace** (metadata display): JetBrains Mono or SF Mono

**Scale**:
- Hero headline: 4rem (64px)
- Section headline: 2.5rem (40px)
- Body large: 1.25rem (20px)
- Body default: 1rem (16px)
- Caption: 0.875rem (14px)

### Spacing & Rhythm
- Base unit: 8px
- Generous whitespace between sections (120-160px)
- Tight grouping for related content (16-24px)
- Consistent padding on cards (32px)

---

## Homepage: Scroll Storytelling Hero

### Layout Structure

**Fixed Center Column**  
60% viewport width on desktop, 90% on mobile.  
Image and text remain vertically centered as user scrolls.

**Scroll Behavior**  
Each scene occupies ~100vh.  
As user scrolls, current scene fades out, next scene fades in.  
Text changes are synchronized with image transitions.

---

### Scene 1: Upload

**Image**: `/images/scene-1-upload.{ext}`  
Visual of drag-and-drop interface or upload action.

**Text Hierarchy**:
- **Overline** (small, accent color): "Step 1"
- **Headline**: "Start with your images"
- **Body**: "Upload one photo or hundreds. We'll handle the rest with care."

**Emotional Tone**: Inviting, simple, non-technical.

---

### Scene 2: Hidden Metadata

**Image**: `/images/scene-2-metadata.{ext}`  
Visualization of invisible data layers within an image.

**Text Hierarchy**:
- **Overline**: "Step 2"
- **Headline**: "Every image carries invisible data"
- **Body**: "Location coordinates, device details, timestamps—hidden in plain sight."

**Emotional Tone**: Awareness without alarm. Informative, not scary.

---

### Scene 3: Privacy Risk

**Image**: `/images/scene-3-risk.{ext}`  
Conceptual visual showing privacy exposure (e.g., map pins, device icons).

**Text Hierarchy**:
- **Overline**: "Step 3"
- **Headline**: "Your privacy at risk"
- **Body**: "Shared images can reveal where you live, what you use, and when you were there."

**Emotional Tone**: Calm concern. Measured, not panicked. Educational.

**Visual Treatment**: Subtle glow or outline around risk elements, not red/warning colors.

---

### Scene 4: Solution (Product Intervention)

**Image**: `/images/scene-4-solution.{ext}`  
Visual of metadata being removed—clean, confident action.

**Text Hierarchy**:
- **Overline**: "Step 4"
- **Headline**: "We remove what shouldn't be shared"
- **Body**: "Automatic detection and removal of all hidden metadata. Every trace, gone."

**Emotional Tone**: Confidence, relief, control restored.

**Visual Treatment**: Accent color highlights the "clean" state. Smooth, satisfying transition.

---

### Scene 5: Safe Outcome + CTA

**Image**: `/images/scene-5-safe.{ext}`  
Visual of clean, protected image ready to share.

**Text Hierarchy**:
- **Overline**: "Step 5"
- **Headline**: "Share with confidence"
- **Body**: "Your images, your privacy. No hidden traces. Just the memories you want to share."

**CTA Button** (appears after text settles):  
Label: "Try It Now" or "Clean Your Images"  
Style: Large, rounded, accent color fill, subtle shadow, hover lift effect.

**Emotional Tone**: Empowerment, completion, trust earned.

---

### Scroll Transition Details

**Fade Timing**: 600ms ease-in-out between scenes.  
**Scroll Snap**: Optional snap to scene boundaries for precision.  
**Progress Indicator**: Vertical dots on right edge (5 dots, active state highlights current scene).  
**Scroll Speed**: User-controlled, no forced auto-scroll.

---

## Application Interface

### Page Structure

**Header**  
- Logo (left)
- Theme toggle (top-right): Sun/moon icon, smooth transition
- "Back to Home" link (if inside app)

**Footer** (persistent across app)  
- Privacy policy link
- "How it works" link
- Contact or support link

---

### Upload Screen

**Visual Layout**  
Centered upload zone (600px max-width on desktop).

**Upload Zone**:
- Dashed border (accent color, subtle)
- Large icon: Upload cloud or folder (not aggressive)
- Headline: "Drag images here"
- Subtext: "or click to browse"
- Supported formats listed below (small, gray text)

**Interaction States**:
- **Idle**: Dashed border, muted
- **Hover**: Border solidifies, slight background tint
- **Drag-over**: Border brightens, background shifts to accent tint (10% opacity)
- **Uploading**: Border becomes solid, progress ring around icon

**Multiple Upload**:
- After first image selected, upload zone shrinks to top-right corner
- Uploaded images appear as thumbnail grid below
- Each thumbnail shows filename and file size
- Remove icon (X) on hover

---

### Processing Screen

**Layout**  
List of uploaded images (cards, stacked vertically).

Each card shows:
- Thumbnail (left, 80px square)
- Filename
- Progress bar (if processing)
- Status indicator:
  - "Analyzing..." (pulsing accent dot)
  - "Removing metadata..." (accent spinner)
  - "Complete" (success color checkmark)

**Batch Progress** (top of screen):  
"Processing 3 of 12 images"  
Overall progress bar (thin, accent color).

**No Aggressive Loaders**:  
Use skeleton loaders (subtle gray shimmer), not heavy spinners.

---

### Analysis & Removal Screen

**Two-Column Layout** (desktop) / Stacked (mobile)

**Left Column: Metadata Found**  
- Card with title "Metadata Detected"
- Grouped categories:
  - **Location**: GPS coordinates, altitude
  - **Device**: Camera make, model, software
  - **Timestamps**: Created, modified dates
  - **Camera Settings**: ISO, aperture, focal length
  - **Other**: Orientation, color profile
- Each item: Label + value in monospace font
- Subtle dividers between categories

**Right Column: Preview**  
- Image preview (max 400px)
- Toggle: "Show Original" / "Show Cleaned" (if removal already done)

**Action Button** (bottom-center):  
"Remove All Metadata" — Large, accent color, confident.

**Post-Removal State**:  
- Left column updates to show "Removed" list
- Success message appears: "All metadata removed"
- Right column shows cleaned image
- Download options appear

---

### Download Screen

**Card Layout**  
- Image thumbnail (centered, 200px)
- Filename (clean suffix added)
- File size comparison: "Original: 4.2 MB → Cleaned: 3.8 MB"

**Download Options**:
- **Single Download**: Button per image ("Download")
- **Batch Download**: Floating action button (bottom-right): "Download All (ZIP)"

**Post-Download**:
- Success toast notification (top-right): "Downloaded successfully"
- Option: "Clean More Images" (returns to upload)

---

## Interaction & Animation Principles

### Micro-Interactions
- **Button hover**: Slight scale (1.02x), shadow deepens
- **Card hover**: Subtle lift (4px translateY), shadow expands
- **Toggle switches**: Smooth slide (200ms ease)
- **Progress bars**: Animated fill (not jumpy)

### Loading States
- **Skeleton loaders** for content that's loading
- **Fade-in** for content that appears (300ms)
- **Stagger** for list items (50ms delay per item)

### Feedback
- **Success**: Green checkmark + toast notification
- **Error**: Inline message below input (not modal)
- **Empty state**: Friendly icon + helpful text ("No images yet. Upload to begin.")

---

## Dark/Light Mode Transition

**Toggle Behavior**:  
Click sun/moon icon → entire page transitions smoothly (400ms).  
All colors interpolate (no flash).

**Persistence**:  
User preference saved in localStorage.  
Respects system preference on first visit.

---

## Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

**Mobile Adjustments**:
- Single-column layouts
- Larger touch targets (48px minimum)
- Bottom navigation for primary actions
- Upload zone full-width

---

## Accessibility

- **Keyboard navigation**: All interactive elements reachable via Tab
- **Focus states**: Visible outline (accent color, 2px)
- **Screen reader**: ARIA labels on icons, alt text on images
- **Contrast ratios**: WCAG AA compliant (4.5:1 minimum)

---

## Emotional Pacing Summary

| Screen | Emotion Goal |
|--------|--------------|
| Hero Scene 1-2 | Curiosity, awareness |
| Hero Scene 3 | Concern (calm, not fear) |
| Hero Scene 4 | Relief, control |
| Hero Scene 5 | Confidence, empowerment |
| Upload | Simplicity, ease |
| Processing | Trust, transparency |
| Analysis | Clarity, understanding |
| Download | Satisfaction, completion |

---

## Design Anti-Patterns to Avoid

- ❌ Neon green "hacker" aesthetics
- ❌ Red warning screens
- ❌ Aggressive gradient backgrounds
- ❌ Over-animated UI (distracting)
- ❌ Cluttered metadata displays
- ❌ Generic lock icons everywhere
- ❌ Overly technical language

---

## Design Checklist

- ✅ Calm, premium color palette
- ✅ Generous whitespace
- ✅ Smooth, purposeful animations
- ✅ Clear visual hierarchy
- ✅ Transparent process visibility
- ✅ Accessible across modes and devices
- ✅ Trust signals without clichés