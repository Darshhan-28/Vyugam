# Non-Destructive UI & UX Enhancements Plan for VYUGAM 2.0

## Context & Objective
The user requested recommended UI and UX enhancements with a strict constraint:
> **Do not change the current visual look, aesthetic, palette, typography, or theme of the website in any way.**

All proposed enhancements are non-destructive, underlying improvements focusing on **accessibility (a11y)**, **mobile usability**, **performance / Core Web Vitals**, **interaction polish**, and **SEO / meta optimizations**.

---

## Proposed UI Enhancements (Zero Visual Change)

### 1. Performance & Bundle Optimization (Instant Load Experience)
- **Route-level Code Splitting**: 
  - Current bundle is `820 kB` in a single monolithic chunk.
  - Implement `React.lazy()` and `<Suspense>` in `src/App.tsx` for hidden routes (`/pass/:token`, `/admin`, `/scan`) and heavy overlays (`RegisterModal`).
  - *Result*: Faster First Contentful Paint (FCP) for the main symposium landing page on mobile 3G/4G networks without changing a single pixel.
- **Font Display Strategy**:
  - Add `&display=swap` parameter verification and `preload` headers to Google Fonts in `index.html` to eliminate FOIT (Flash of Invisible Text).
- **Cumulative Layout Shift (CLS) Prevention**:
  - Ensure all static images (`/pacet-logo-nobg.png`, `/it-dept-logo.png`, `/eventopia-logo.svg`, `/upi-qr.png`) include explicit `width`, `height`, `loading="lazy"`, and `decoding="async"` attributes to prevent page jumping during scroll.

### 2. Accessibility & Keyboard Navigation (A11y)
- **Keyboard Trapping & Escape-to-Close in Modals**:
  - In `src/components/RegisterModal.tsx`:
    - Listen for the `Escape` key to close the modal gracefully.
    - Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="register-modal-title"`.
    - Auto-focus the first form field when opened, and return focus to the trigger button when closed.
- **Accessible Focus Rings (`:focus-visible`)**:
  - Provide a subtle, matching `outline: 2px solid #FDB515` (marigold) on `:focus-visible` for keyboard navigation across all buttons, tabs, and interactive chips without showing outlines during mouse clicks.
- **Screen Reader Context for Icon-only Buttons**:
  - Add `aria-label` to the scroll-to-top button (`"Scroll back to top"`), floating ticket button, and close buttons on modals/toasts.

### 3. Mobile Usability & Form Polish
- **iOS Zoom Prevention on Input Focus**:
  - In `src/components/RegisterModal.tsx`, ensure form input fields maintain a computed font size of at least `16px` on screens `< 640px` (or Tailwind `text-base sm:text-sm`) to prevent iOS Safari from automatically zooming into form fields upon tap.
- **Scroll Lock / Background Containment**:
  - When `RegisterModal` is open, apply `overflow: hidden` and `overscroll-behavior: contain` to `document.body` to prevent background page scroll while scrolling through the registration form on touch devices.
- **Form Submission State Protection**:
  - Disable input elements and submit button while the registration API call or image upload is processing to prevent accidental double submissions.

### 4. Search Engine & Social Share Previews (SEO & PWA Meta)
- **Browser Theme Color**:
  - Add `<meta name="theme-color" content="#050505" />` to `index.html` to blend mobile browser address bars seamlessly into the obsidian background.
- **OpenGraph & Twitter Card Metadata**:
  - Add `og:title`, `og:description`, `og:image`, `og:type="website"`, and `twitter:card="summary_large_image"` to `index.html` so links shared on WhatsApp, LinkedIn, or Twitter display rich event preview cards.

---

## Affected Files
1. `index.html` — Theme color, OpenGraph meta tags, preconnect/font optimizations.
2. `src/App.tsx` — Code-splitting with `React.lazy` and `Suspense`.
3. `src/components/RegisterModal.tsx` — Escape key handler, focus management, a11y attributes, iOS input font size.
4. `src/components/Navbar.tsx` & `src/components/FAQ.tsx` — ARIA attributes (`aria-expanded`, `aria-controls`).

---

## Validation Plan
1. **Visual Regression Check**: Compare desktop and mobile renders side-by-side to ensure zero visual discrepancy.
2. **Build Verification**: Run `npm run build` (`tsc && vite build`) to confirm chunk splitting and build success.
3. **Keyboard & Mobile Testing**: Test Tab / Shift+Tab navigation, Escape key modal dismissal, and touch inputs on mobile viewport.
