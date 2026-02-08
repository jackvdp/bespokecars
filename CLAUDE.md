# Bespoke Cars - Design System

## Brand Overview

### About the Business
**Bespoke Cars** is a premium luxury car rental company with over 15 years of experience creating unforgettable experiences across the UK. The brand positions itself as the trusted choice for life's most important moments — weddings, photoshoots, corporate events, and special occasions.

### Brand Tagline
*"Where Luxury Meets Your Most Important Moments"*

### Key Brand Messages
- **15+ years of excellence** in the luxury car rental industry
- **10,000+ successful events** completed across the UK
- **Trusted by thousands** of discerning clients
- **Complete peace of mind** with full insurance, 24/7 support, and professional delivery

### Brand Values
1. **Unmatched Experience** — Anticipating needs, exceeding expectations, delivering flawless service
2. **Curated Excellence** — Hand-selected vehicles, meticulous maintenance, pristine condition
3. **Comprehensive Service** — Full insurance, flexible scheduling, professional delivery, 24/7 support
4. **Trusted Reputation** — From intimate weddings to high-profile corporate events

---

## Services Offered

### Wedding Car Hire
The UK's most trusted wedding car specialists with 10,000+ successful weddings. Curated collection of luxury wedding cars ensuring arrivals are as perfect as the celebration.

### Photoshoot & Film Hire
Stunning supercar and luxury vehicle collection for high-end photoshoots, commercials, and film productions. 15+ years of industry experience for seamless creative service.

### Limousine Service
Premium limousine service for hen and stag parties, prom nights, group celebrations. Spacious luxury interiors and professional service for grand entrances.

### Self Drive Experience
Premium self-drive rentals for weekend adventures or extended journeys. Experience luxury and performance exploring London and beyond.

### Corporate & Event Hire
Prestigious vehicle collection for executive transportation, marketing campaigns, product launches, and VIP events. Custom branding and decal application available.

### Private Chauffeur Services
Professional chauffeur service with expertly trained drivers. Discreet, reliable transportation for business meetings, special occasions, and VIP experiences.

### Vehicle Leasing
Flexible leasing options tailored to individual circumstances. Drive your dream car on your terms.

### Close Protection
Discreet, secure transportation with trained security-cleared drivers for clients requiring enhanced security.

---

## Design Philosophy
Premium luxury car rental website with a dark, modern aesthetic featuring neon cyan accents. The design emphasises sophistication, trust, and premium quality through clean typography, subtle animations, and strategic use of the cyan glow effect.

---

## Colour Palette

### Primary Colours
| Name | Value | Usage |
|------|-------|-------|
| Background | `oklch(0 0 0)` / `#000000` | Page backgrounds |
| Foreground | `oklch(1 0 0)` / `#ffffff` | Primary text |
| Primary/Accent | `oklch(0.85 0.2 195)` / `var(--primary)` | Neon cyan - buttons, highlights, accents, borders, glows |

### Cyan Glow Effect
The signature design element - used for hover states, borders, and emphasis:
```css
/* Standard glow */
box-shadow: 0 0 30px var(--primary);

/* Subtle glow */
box-shadow: 0 0 20px rgba(0, 210, 200, 0.2);

/* Text glow */
text-shadow: 0 0 20px var(--primary);
```

### Text Colours
| Element | Colour | Opacity |
|---------|--------|---------|
| Headings | `var(--foreground)` | 100% |
| Section labels | `var(--primary)` | 100% |
| Body text | `rgba(255, 255, 255, 0.6)` | 60% |
| Muted/subtle text | `rgba(255, 255, 255, 0.4)` | 40% |
| Card descriptions | `rgba(255, 255, 255, 0.5)` | 50% |

### UI Element Colours
| Element | Value |
|---------|-------|
| Card background | `rgba(255, 255, 255, 0.03)` |
| Card border | `rgba(255, 255, 255, 0.08)` |
| Card hover background | `rgba(255, 255, 255, 0.05)` |
| Card hover border | `var(--primary)` |
| Translucent overlay | `rgba(0, 0, 0, 0.7)` or `rgba(0, 0, 0, 0.8)` |
| Dividers | `var(--primary)` at 50% opacity |
| Accent lines | `var(--primary)` at 60-80% opacity |
| Featured image border | `2px solid var(--primary)` with glow |

---

## Typography

### Fonts
| Type | Font | Variable |
|------|------|----------|
| Title/Display | Outfit | `--font-title` |
| Body | Inter | `--font-body` |

### Heading Styles
```css
/* Section Label (above main heading) */
font-family: var(--font-body);
font-size: 12-14px;
font-weight: 500;
letter-spacing: 0.2em;
text-transform: uppercase;
color: var(--primary);

/* Section Heading */
font-family: var(--font-title);
font-size: clamp(32px, 5vw, 56px);
font-weight: 600;
letter-spacing: -0.02em;
color: var(--foreground);

/* Card/Component Heading */
font-family: var(--font-title);
font-size: 18-24px;
font-weight: 600;
letter-spacing: -0.01em;
color: var(--foreground);

/* Body Text */
font-family: var(--font-body);
font-size: 14-16px;
font-weight: 400;
line-height: 1.5-1.6;
color: rgba(255, 255, 255, 0.5-0.6);
```

---

## Section Layout

### Spacing
| Element | Value |
|---------|-------|
| Section padding (vertical) | `120px` |
| Section padding (horizontal) | `24px` |
| Max content width | `1200px` |
| Header to content gap | `80px` |
| Card gap | `24-40px` |
| Component margin top | `60-120px` |

### Section Structure
```tsx
<section style={{
  minHeight: '100vh',
  backgroundColor: 'var(--background)',
  padding: '120px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1, // Important for scroll-over effects
}}>
  <SectionBackground glowPosition="both" gridFadeDirection="down" />
  
  <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
    {/* Content */}
  </div>
</section>
```

---

## Background Pattern

Use the `<SectionBackground />` component for consistent section backgrounds.

### Props
| Prop | Type | Default | Options |
|------|------|---------|---------|
| `glowPosition` | string | `'both'` | `'top'`, `'bottom'`, `'both'` |
| `gridFadeDirection` | string | `'down'` | `'down'`, `'up'`, `'both'`, `'none'` |

### Background Elements
1. **Top Glow**: Cyan radial gradient at top center (15% opacity)
2. **Bottom Glow**: Cyan radial gradient at bottom right (10% opacity)
3. **Grid Pattern**: 60px grid with white lines (8% opacity), fading based on direction (stays visible throughout section at 50% minimum)

---

## Cards

### Card Component
Use the `<Card />` component for consistent card styling.

```tsx
import Card from '@/components/Card'

<Card index={0} showAccentLine={true} animateOnScroll={true}>
  {/* Card content */}
</Card>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Card content |
| `index` | number | `0` | Index for stagger animation delay |
| `showAccentLine` | boolean | `true` | Show cyan accent line at top |
| `animateOnScroll` | boolean | `true` | Enable scroll-triggered fade-up animation |

### Card Styles
- Padding: `40px`
- Border radius: `24px`
- Background: `rgba(255, 255, 255, 0.03)`
- Border: `1px solid rgba(255, 255, 255, 0.08)`

### Card Hover State
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `var(--primary)`

### Overlay Card (on images/video)
```css
padding: 24px;
border-radius: 16px;
background-color: rgba(0, 0, 0, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Service Overlay Card (larger)
```css
padding: 48px;
border-radius: 32px;
background-color: rgba(0, 0, 0, 0.8);
border: 1px solid rgba(255, 255, 255, 0.1);
/* Plus internal grid pattern at 3% opacity */
```

---

## Primary Button

### PrimaryButton Component
Use the `<PrimaryButton />` component for main call-to-action buttons with the signature neon glow hover effect.

```tsx
import PrimaryButton from '@/components/PrimaryButton'

<PrimaryButton href="#book" size="large">
  Book Now
</PrimaryButton>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Button text/content |
| `href` | string | optional | Link URL (renders as `<a>` tag) |
| `onClick` | function | optional | Click handler (renders as `<button>` tag) |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Button size |

### Size Variants
| Size | Padding | Font Size |
|------|---------|-----------|
| `small` | `10px 24px` | `12px` |
| `medium` | `14px 36px` | `13px` |
| `large` | `16px 48px` | `14px` |

### Button Styles
- Background: `var(--primary)` (neon cyan)
- Text colour: `var(--background)` (black)
- Border radius: `9999px` (pill shape)
- Font weight: `600`
- Letter spacing: `0.1em`
- Text transform: `uppercase`

### Hover Animation
```tsx
whileHover={{
  scale: 1.05,
  boxShadow: '0 0 30px var(--primary)',
}}
whileTap={{ scale: 0.98 }}
transition={{ duration: 0.2 }}
```

---

## Secondary Button

### SecondaryButton Component
Use the `<SecondaryButton />` component for secondary actions with a translucent background and border.

```tsx
import SecondaryButton from '@/components/SecondaryButton'

<SecondaryButton href="#services" size="large">
  View Our Services
</SecondaryButton>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Button text/content |
| `href` | string | optional | Link URL (renders as `<a>` tag) |
| `onClick` | function | optional | Click handler (renders as `<button>` tag) |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Button size |

### Size Variants
| Size | Padding | Font Size |
|------|---------|-----------|
| `small` | `10px 24px` | `12px` |
| `medium` | `14px 36px` | `13px` |
| `large` | `16px 48px` | `14px` |

### Button Styles
- Background: `rgba(255, 255, 255, 0.05)` (translucent)
- Text colour: `var(--foreground)` (white)
- Border: `2px solid rgba(255, 255, 255, 0.3)`
- Border radius: `9999px` (pill shape)
- Font weight: `600`
- Letter spacing: `0.1em`
- Text transform: `uppercase`

### Hover Animation
```tsx
whileHover={{
  scale: 1.05,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderColor: 'var(--primary)',
  boxShadow: '0 0 20px rgba(0, 210, 200, 0.2)',
}}
whileTap={{ scale: 0.98 }}
transition={{ duration: 0.2 }}
```

---

## Accent Elements

### Top Accent Line (Cards)
Gradient line at top of cards - always visible.
```css
position: absolute;
top: 0;
left: 40px;
right: 40px;
height: 2px;
background: linear-gradient(90deg, transparent, var(--primary), transparent);
opacity: 0.6-0.8;
```

### Vertical Dividers (Between items)
```css
width: 1px;
height: 40px;
background: linear-gradient(180deg, transparent, var(--primary), transparent);
opacity: 0.5;
```

### Gradient Numbers
Large display numbers with cyan-to-transparent gradient.
```css
font-size: 64px;
font-weight: 700;
font-family: var(--font-title);
background: linear-gradient(180deg, var(--primary) 0%, rgba(255,255,255,0.1) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Featured Image Border
```css
border: 2px solid var(--primary);
border-radius: 24px;
box-shadow: 0 0 30px rgba(0, 210, 200, 0.2);
```

---

## Animations

### Standard Easing
```tsx
ease: [0.22, 1, 0.36, 1] // Premium feel easing
```

### Scroll-triggered Slide In
Using Framer Motion's `useScroll` and `useTransform`:
```tsx
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start 0.8", "start 0.1"]
})

// Slide from right
const x = useTransform(scrollYProgress, [0, 1], ["100%", "0%"])
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])

// Slide from left (opposite)
const xLeft = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"])

// Slide up
const y = useTransform(scrollYProgress, [0, 0.5], ["50px", "0px"])
```

### Card Stagger Animation
```tsx
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-50px' }}
transition={{
  duration: 0.6,
  delay: index * 0.15,
  ease: [0.22, 1, 0.36, 1],
}}
```

### Quick Pop-up (for overlay cards)
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-200px' }}
transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
```

### Content Transition (ScrollVideo overlays)
```tsx
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -15 }}
transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
```

### Hover Scale
```tsx
whileHover={{ scale: 1.05-1.15 }}
transition={{ duration: 0.2, ease: 'easeOut' }}
```

### Hover Glow (navigation, buttons)
```tsx
whileHover={{ 
  color: 'var(--primary)',
  textShadow: '0 0 20px var(--primary)',
}}
transition={{ duration: 0.2 }}
```

---

## Navbar

### Structure
- Fixed position, pill-shaped container
- Transparent by default, frosted glass on scroll
- Logo (text) on left, nav links center (desktop only), CTA button right
- Hamburger menu on mobile only

### Scroll State
```tsx
animate={{
  backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
  backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
  borderColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
}}
```

### Nav Link Hover
```tsx
whileHover={{ 
  color: 'var(--primary)',
  textShadow: '0 0 20px var(--primary)',
}}
transition={{ duration: 0.2 }}
```

---

## ScrollVideo Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Video source path |
| `textOverlays` | TextOverlay[] | `[]` | Array of text overlays with progress ranges |
| `scrollHeight` | string | `'300vh'` | Total scroll distance for video |
| `showScrollIndicator` | boolean | `true` | Show scroll arrow at bottom |
| `overlayGradient` | boolean | `true` | Show gradient overlay on video |
| `customOverlay` | function | optional | Custom overlay component |
| `contentFadeIn` | number | `0` | Progress (0-1) at which content starts appearing |

### Two Timelines
1. **Video Timeline**: Plays while any part of container is visible
2. **Content Timeline**: Only active when video is 100% in frame

### Overlay Progress Ranges
Overlays should overlap slightly to minimize gaps:
```tsx
// Example: 4 overlays
{ startProgress: 0, endProgress: 0.27 }
{ startProgress: 0.23, endProgress: 0.52 }
{ startProgress: 0.48, endProgress: 0.77 }
{ startProgress: 0.73, endProgress: 1 }
```

---

## Scrollbar

Custom neon cyan scrollbar:
```css
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 3px;
}

/* Firefox */
scrollbar-width: thin;
scrollbar-color: var(--primary) transparent;
```

---

## Logo Treatment

Brand logos displayed with grayscale filter:
```css
filter: grayscale(100%) brightness(1.5);
```
With hover scale effect (1.15x).

---

## Component Checklist

When creating a new section:
- [ ] Use `position: relative` and `zIndex: 1` on section
- [ ] Add `<SectionBackground />` component
- [ ] Use section padding: `120px 24px`
- [ ] Max width container: `1200px`
- [ ] Section label: cyan, uppercase, 0.2em letter-spacing, 12-14px
- [ ] Main heading: white, clamp sizing, -0.02em letter-spacing
- [ ] Body text: 60% white opacity, 1.6 line-height
- [ ] Cards: Use `<Card />` component or glass effect styling
- [ ] Buttons: Use `<PrimaryButton />` or `<SecondaryButton />`
- [ ] Consider scroll-triggered animations for content
- [ ] Add cyan glow effects on hover states
- [ ] Featured images: cyan border with glow

---

## File Structure
```
/app
  - page.tsx
  - layout.tsx
  - globals.css
/components
  - Navbar.tsx
  - ScrollVideo.tsx
  - ServiceOverlay.tsx
  - HowItWorks.tsx
  - SectionBackground.tsx
  - Card.tsx
  - PrimaryButton.tsx
  - SecondaryButton.tsx
/public
  /videos
  /images
    /logos
    /cars
```

---

## Coding Standards

### Styling Approach
**Always use inline `style={{}}` objects for styling.** Tailwind CSS classes do not work in this project — they are not applied at runtime. Use inline styles for all layout, spacing, colours, and typography.

```tsx
// ✅ Good - use inline styles
<div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', pointerEvents: 'none' }} />

// ❌ Avoid - Tailwind classes (do not work)
<div className="absolute inset-0 bg-black/40 pointer-events-none" />
```

### CSS Variables
Reference CSS variables directly in inline styles:
```tsx
style={{ color: 'var(--primary)' }}
style={{ backgroundColor: 'var(--background)' }}
style={{ fontFamily: 'var(--font-title)' }}
```

### Common Inline Style Patterns
```tsx
// Card background
style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px' }}

// Section padding
style={{ padding: '120px 24px' }}

// Max width container
style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}

// Text styles
style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' }}
style={{ color: 'var(--foreground)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-0.02em' }}
style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', lineHeight: 1.6 }}

// Flex/Grid layouts
style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}
```
