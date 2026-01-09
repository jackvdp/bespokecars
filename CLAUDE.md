# Bespoke Cars - Design System

## Brand Overview
Premium luxury car rental website with a dark, modern aesthetic featuring neon cyan accents.

---

## Colour Palette

### Primary Colours
| Name | Value | Usage |
|------|-------|-------|
| Background | `oklch(0 0 0)` / `#000000` | Page backgrounds, cards |
| Foreground | `oklch(1 0 0)` / `#ffffff` | Primary text |
| Primary/Accent | `oklch(0.85 0.2 195)` | Neon cyan - buttons, highlights, accents |
| Primary Glow | `oklch(0.85 0.2 195 / 50%)` | Glow effects, shadows |

### Text Colours
| Element | Colour | Opacity |
|---------|--------|---------|
| Headings | `var(--foreground)` | 100% |
| Section labels | `var(--primary)` | 100% |
| Body text | `rgba(255, 255, 255, 0.6)` | 60% |
| Muted/subtle text | `rgba(255, 255, 255, 0.4)` | 40% |

### UI Element Colours
| Element | Value |
|---------|-------|
| Card background | `rgba(255, 255, 255, 0.03)` |
| Card border | `rgba(255, 255, 255, 0.08)` |
| Card hover background | `rgba(255, 255, 255, 0.05)` |
| Card hover border | `var(--primary)` |
| Dividers | `var(--primary)` at 50% opacity |
| Accent lines | `var(--primary)` at 60% opacity |

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
font-size: 14px;
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

/* Card Title */
font-family: var(--font-title);
font-size: 24px;
font-weight: 600;
letter-spacing: -0.01em;
color: var(--foreground);

/* Body Text */
font-family: var(--font-body);
font-size: 16px;
font-weight: 400;
line-height: 1.6;
color: rgba(255, 255, 255, 0.6);
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
| Card gap | `40px` |
| Logo gap | `40px` |

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
3. **Grid Pattern**: 60px grid with white lines (6% opacity), fading based on direction

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
opacity: 0.6;
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

---

## Animations

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

### Hover Scale
```tsx
whileHover={{ scale: 1.15 }}
transition={{ duration: 0.2, ease: 'easeOut' }}
```

---

## Navbar

### Structure
- Fixed position, capsule-shaped container
- Transparent by default, frosted glass on scroll
- Logo (text) on left, nav links center, CTA button right

### Scroll State
```tsx
animate={{
  backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
  backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
  borderColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
}}
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
```

---

## Component Checklist

When creating a new section:
- [ ] Use `position: relative` on section for background
- [ ] Add `<SectionBackground />` component
- [ ] Use section padding: `120px 24px`
- [ ] Max width container: `1200px`
- [ ] Section label: cyan, uppercase, 0.2em letter-spacing
- [ ] Main heading: white, clamp sizing, -0.02em letter-spacing
- [ ] Cards: glass effect with cyan accent line at top
- [ ] Consider scroll-triggered animations for content
