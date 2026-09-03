# Animated Web Design Rules

These rules apply to every website / landing page / web app built in this project.
Never ship a static, unanimated site. Motion is not decoration here — it is a core
requirement, on the same priority level as layout and content.

## Stack (default unless told otherwise)

- React (or Next.js for anything with routing)
- **Framer Motion** for component-level animation (entrance, hover, layout, gestures,
  scroll-triggered reveals via `whileInView`)
- **GSAP + ScrollTrigger** for complex timeline-based scroll storytelling, pinning,
  parallax, and anything Framer Motion can't cleanly express
- Tailwind CSS for styling, with custom keyframes added in `tailwind.config` for
  anything reusable (float, shimmer, gradient-shift, marquee, etc.)
- Optional, only when it clearly earns its cost: `three.js` / `react-three-fiber`
  for hero-section 3D, `lenis` for smooth scrolling

## Non-negotiable animation coverage

Every site must include ALL of the following, adapted to the content:

1. **Page load** — staggered entrance for hero content (text lines, image, CTA),
   never all-at-once fade-in
2. **Scroll reveals** — sections/cards animate in as they enter viewport
   (fade+translate, stagger children, or a scroll-scrubbed effect for hero/feature
   sections)
3. **Micro-interactions** — buttons, links, and cards react to hover/tap/focus
   (scale, magnetic pull, underline draw, color morph, shadow lift) — never a bare
   CSS `:hover { color: ... }` with no motion
4. **Page/route transitions** — animate out/in between routes, not an instant cut
5. **Loading state** — a designed loader/skeleton, not a blank white flash
6. **At least one signature moment** — one standout, memorable animation per site
   (a hero text scramble/reveal, a scroll-pinned narrative section, an animated
   gradient mesh background, a cursor-follow effect, a marquee, morphing SVG shapes)
7. **Reduced motion support** — respect `prefers-reduced-motion`; provide a
   non-animated fallback path, don't just disable everything silently

## Visual/design bar

- Typography does real work: large, confident type scale, tight tracking on
  headlines, at least one expressive display font pairing (not just system font)
- Color: a real palette with intent (accent gradient, dark/light contrast done on
  purpose), not default Tailwind gray-on-white
- Depth via layering: soft shadows, subtle glassmorphism where it fits, gradients
  that shift on scroll or hover, not flat single-color blocks everywhere
- Generous whitespace and a clear visual hierarchy — animation should never be used
  to compensate for weak layout
- Custom cursor, grain/noise texture, or animated background gradient are good
  defaults to reach for on hero sections unless the brief says minimal/corporate

## Performance rules (so "rich" doesn't mean "janky")

- Animate `transform` and `opacity` only where possible; avoid animating layout
  properties (width, top, left) — use `transform: translate/scale` instead
- Add `will-change` sparingly, only on elements actively animating
- Use `viewport={{ once: true }}` on scroll-reveal animations unless re-triggering
  is intentional
- Lazy-load heavy visual assets (3D scenes, large images/video) and gate their
  animation start on load-complete
- Keep FPS in mind: prefer CSS/GPU-accelerated transforms over JS-driven layout
  thrashing; test with 4x CPU throttle mentally before calling it done

## Before declaring a site finished, self-check:

- [ ] Does every interactive element have a hover/tap animation?
- [ ] Does the page have a staggered entrance, not a flat fade?
- [ ] Do sections reveal on scroll?
- [ ] Is there one genuinely memorable/signature animated moment?
- [ ] Does `prefers-reduced-motion` degrade gracefully?
- [ ] Would this look generic/templated with the animations removed? If yes,
      the layout needs more design work, not just more motion.

## Tone

Default to bold, modern, "award-site" energy (think Awwwards/FWA showcase sites,
Framer Motion's own site, Linear.app, Stripe's marketing pages) rather than a
plain SaaS-template look — unless the user explicitly asks for something minimal,
corporate, or accessible-first.
