# Visionary Productions — Website Build Brief (for Claude Code)

This is the build spec for the Visionary Productions website. Scaffold and build it in the repo
**https://github.com/BuzzyWrld/visionary-Productions-**. Treat this file as the source of truth.
Drop it at the repo root as `CLAUDE.md` (or `docs/BUILD.md`) and work through the build order at the
bottom.

House rule, enforced everywhere: **zero em-dashes or en-dashes** in code comments, copy, or commits.
Use periods, commas, or the word "to" for ranges.

---

## 1. What this is

A pure-portfolio photography site for **Visionary Productions**, the brand of NYC editorial, event,
and lifestyle photographer **Malachi "Kai" Sydney** (@kai_photoproductions). Tagline:
*Executing visions by the day.* The site exists to show the work, tell the story, and turn the right
visitor into a booked session. Photos lead, the design recedes, the brand respects the visitor's own
light or dark setting.

Primary goal: bookings from people who found the work and respect the price. The one metric that
matters is booked sessions per month, not followers.

---

## 2. Stack (lean, do not over-build)

- **Astro** (static-first) deployed on **Vercel**. The reference site Alche.studio runs Astro 5; we match it.
- **No database**, no Supabase, no n8n for v1.
- Motion: **Lenis** (smooth scroll) + **GSAP** + **ScrollTrigger** + **SplitType**. All vendored in the
  motion library asset (see section 4). Install via `npm i lenis gsap split-type`.
- Booking: **Calendly** embed.
- Deposits: **Stripe Payment Link** (no custom checkout).
- Newsletter: **Beehiiv** embed.
- Contact form: one Astro **serverless function** that posts submissions to **Airtable** (Kai/Buzzy's CRM).
- Fonts: **Fraunces** (display), **Work Sans** (body), **Space Mono** (labels), via Google Fonts.

---

## 3. Reference implementations (already built, port these)

These files are the design source of truth. Match their look, motion, and copy exactly, then refactor
into Astro components. Do not redesign.

- `Visionary_Site_01_Home.html` — the **home page**, fully built and approved. Contains the vision-open
  intro animation, the centered one-line hero on a photo with brand-blue wash + grain, the Community
  Archive cover mosaic, the highlight-animation system, adaptive light/dark, Lenis + GSAP motion.
- `Visionary_Site_02_Portfolio.html` — the **portfolio page**. Brand story, then the four category covers.
- `Visionary_Productions_Brand_Kit.pdf` — logo system, color tokens (light + dark), type, application rules.
- `Visionary_Productions_Brand_Playbook.pdf` — voice, audience, offer, pricing tiers, messaging bank, content.
- `Visionary_Productions_brand.json` — machine-readable brand foundation (tokens, voice, copy, offer).
- `Visionary_Motion_Library.zip` — vendored Lenis/GSAP/SplitType + numbered snippets + the SKILL.md teardown
  of the Alche motion recipe. Use these snippets as the motion implementation.

Porting rule: the two HTML files inline the libraries and base64 the images for preview. In Astro, import
the libraries via npm and load images as optimized assets. Keep the CSS variables and the markup structure.

---

## 4. Brand system (from brand.json and the Brand Kit)

**Color tokens.** Define once in a global stylesheet as CSS variables. Light is default, dark overrides
via `prefers-color-scheme` plus a manual toggle that wins over the system.

```
Brand hues:  Vision Blue #2456B8 / lt #6E9BF2   Golden Hour #C9772E / lt #E0934A
             Ink #14181F   Paper #FAF7F1   Fog #ECE7DD   Slate #5B6675
             Midnight #0E1117   Surface-dark #171D27   Warm-white #F4F1EA   Mist #98A2B2
Light tokens: bg Paper, surface #FFF, text Ink, muted Slate, accent Vision Blue, warm Golden Hour
Dark tokens:  bg Midnight, surface Surface-dark, text Warm-white, muted Mist, accent Blue-lt, warm Gold-lt
```

No purple, ever. No pure #000000. Grain shows on dark fields only (except the hero, where it is always on).

**Fonts.** Fraunces (display, 400/500/600), Work Sans (body, 300/400/500/600), Space Mono (labels, 400/700).
Fraunces never under 20px. Space Mono is labels and metadata only.

**Logo.** Viewfinder crop-mark brackets framing a single V. Rebuild as a clean inline SVG component that
uses `currentColor` so it flips with the theme. Variants: primary lockup, horizontal (nav), monogram
(favicon/avatar). The SVG is in both reference HTML files, copy it.

**Grain.** SVG `feTurbulence` filter (`baseFrequency 0.62`, `numOctaves 3`), applied as a fixed overlay with
low opacity and `mix-blend-mode: overlay`. Copy the `#vgrain` filter from the reference files.

---

## 5. Motion system (from the motion library)

Build all motion off ONE Lenis + GSAP loop (snippet 02 in the motion library). Then:

- **Vision intro** (home only): two midnight lids part from a center slit to full frame, like an eye
  opening, the word "Open your vision" fading as it opens, hero focusing in behind. Then the hero text
  reveals. Copy the timeline from the home reference. **Make it run once per session** (set a flag), add a
  tap-to-skip, and keep it under 2 seconds on mobile.
- **Hero**: photo behind, brand-blue gradient wash so color leaks through, grain on top, centered one-line
  title-case headline with a soft text-shadow for legibility.
- **Reveals**: elements fade up on scroll (snippet 03). Photos can clip-path wipe in (snippet 05).
- **Highlight system (required on every clickable action)**: nav links get an accent underline that grows
  from the left on hover. Buttons lift and gain an accent glow on hover and `scale(0.97)` on active. The
  theme toggle rotates and turns accent on hover. Cover tiles get an accent ring and a "view" label on
  hover. Text links get an accent underline wipe. This CSS is already in the reference files, port it.
- **Always** respect `prefers-reduced-motion` and gate the heavy effects (pinning, the intro) on mobile.

---

## 6. Global components

- `Nav.astro` — viewfinder logo, links Work / Services / Pricing, accented Inquire button, theme toggle.
  Mobile collapses to logo + Inquire + a menu.
- `Footer.astro` — "Keep creating visions for the community.", IG link, location, copyright.
- `ThemeToggle` — system default, manual override, no flash on load.
- `Grain.astro` — the SVG filter + overlay.
- `SEO.astro` — title, meta description, Open Graph, canonical, per page.
- `Reveal` wrapper / directive — applies the fade-up on scroll.

---

## 7. Pages

Nav is the five from the questionnaire: Home, Portfolio (Work), Services, Pricing, Contact. No About page
(a short "who" line lives on the home and the portfolio story instead).

1. **Home** (`/`) — port `Visionary_Site_01_Home.html` exactly. Vision intro, hero on photo, the "why" line,
   the Community Archive cover mosaic (covers link into the portfolio / their sets), the inquiry CTA band,
   footer.
2. **Portfolio** (`/portfolio`) — port `Visionary_Site_02_Portfolio.html`. The brand story first, then the
   four category covers: Editorial, Events, Lifestyle, Fashion. Each cover links to its category gallery.
3. **Category gallery** (`/portfolio/[category]`) — a category landing that lists the sets/projects in that
   category as covers. Same cover + hover pattern.
4. **Project / set gallery** (`/portfolio/[category]/[set]`) — the actual photo set. Vertical full-bleed
   scroll, around 10 curated images, click opens full size in place (no heavy lightbox, just scroll),
   caption fades in on hover, no watermarks on the gallery images. Clip-path or fade reveal per image.
   Every gallery ends with an inquiry CTA, never a dead end.
5. **Services** (`/services`) — events, fashion/editorial, lifestyle, in Kai's voice (pull from the playbook).
6. **Pricing** (`/pricing`) — the tiers from the playbook: Vision Session, Brand Day, Event Coverage, with
   the deposit-to-book and no-discount logic. **Confirm the actual numbers with Kai before publishing.**
7. **Contact** (`/contact`) — the form (name, email, date, shoot idea, message) posting to Airtable, the
   Calendly embed for booking, the Beehiiv newsletter signup, the footer community line.
8. **Client galleries** (`/clients/[slug]`) — private, password-protected, favorite/select plus high-res
   download. Build the route and gate but keep it hidden and unlinked for v1.

---

## 8. Integrations

- **Calendly**: inline embed on Contact, plus the Inquire CTA can deep-link to it. Env: `PUBLIC_CALENDLY_URL`.
- **Stripe Payment Link**: a hosted link for the deposit. No custom checkout, no card handling. Env: `PUBLIC_STRIPE_DEPOSIT_URL`.
- **Beehiiv**: embed the signup form on Contact and the footer. Env: `PUBLIC_BEEHIIV_EMBED`.
- **Airtable contact**: an Astro endpoint (`src/pages/api/contact.ts`) that takes the form POST and creates a
  row via the Airtable REST API. Env: `AIRTABLE_TOKEN`, `AIRTABLE_BASE`, `AIRTABLE_TABLE`. Validate input,
  rate-limit, return a clean success/fail. Never expose the token to the client.

---

## 9. Images

Kai is sending a folder of approved photos. Until then the previews use two photos cropped as placeholders.
When the folder lands:

- Convert to **WebP** (keep a JPEG fallback), max ~2048px long edge for galleries, ~1600px for hero.
- Use Astro's image pipeline for responsive `srcset` and lazy loading. Below-the-fold images lazy-load.
- Tag two or three frames as **hero candidates**: choose for calm composition with negative space where the
  centered headline sits, not just the flashiest shot.
- Each category and set gets its own real cover. No watermarks on gallery images.

---

## 10. SEO

- Target how clients actually search, not the brand name: "NYC editorial photographer", "NYC event
  photographer", "lifestyle photographer Brooklyn", "fashion photographer New York". Put these in titles,
  H1s, alt text, and copy naturally.
- Per-page title + meta description + Open Graph image. Canonical URLs. `sitemap.xml` and `robots.txt`.
- `LocalBusiness` / `Photograph` schema with NYC location.
- Descriptive alt text on every image.

---

## 11. Performance (this is where it is won or lost)

- Most traffic is mobile off Instagram. Target **sub-3-second** mobile load. Run Lighthouse before "done".
- Progressive enhancement: content and photos render first and fast, motion layers on top, the site works
  with JS off.
- Gate heavy motion (intro, pinning, parallax) to larger viewports. Keep phones fast and simple.
- Intro animation: once per session, skippable, under 2s on mobile.
- Respect `prefers-reduced-motion` everywhere.

---

## 12. Anti-patterns to avoid (from the research)

No kitchen-sink nav. No dated gallery labels ("Fall 2024"). No full-resolution images shipped to the browser.
No buried contact. No generic swappable About copy. No dead-end galleries (every set routes to inquiry).
No slow mobile. No custom cursor (Kai said no). No live Instagram feed (use exported images).

---

## 13. Voice and copy

All copy in Kai's voice: grounded, honest, a little poetic, calm confidence, J Cole adjacent. Short
sentences. No corporate or hype words. Center vision, execution, community. The messaging bank, taglines,
IG bio, blurbs, and the master content prompt are in the Brand Playbook and brand.json. Use them.

---

## 14. Build order and acceptance

Work piece by piece. Each piece is done when it matches the reference, is responsive, respects
reduced-motion, and passes Lighthouse on mobile.

- [ ] 0. Scaffold Astro on Vercel. Global tokens, fonts, grain, theme toggle, Nav, Footer, SEO, motion init.
- [ ] 1. Home (`/`) ported from the reference, including the once-per-session intro and the archive mosaic.
- [ ] 2. Portfolio (`/portfolio`) ported: brand story then category covers.
- [ ] 3. Category gallery (`/portfolio/[category]`).
- [ ] 4. Project/set gallery (`/portfolio/[category]/[set]`) with the scroll-through full-size pattern.
- [ ] 5. Services.
- [ ] 6. Pricing (confirm numbers with Kai).
- [ ] 7. Contact: form to Airtable, Calendly, Beehiiv.
- [ ] 8. Client galleries route (hidden, gated, unlinked).
- [ ] 9. Drop in Kai's real photos, convert to WebP, set hero candidates, write alt text.
- [ ] 10. SEO pass, sitemap, schema. Performance pass, Lighthouse, sub-3s mobile. Ship.

## 15. Env vars

```
PUBLIC_CALENDLY_URL=
PUBLIC_STRIPE_DEPOSIT_URL=
PUBLIC_BEEHIIV_EMBED=
AIRTABLE_TOKEN=
AIRTABLE_BASE=
AIRTABLE_TABLE=
```

## Definition of done

The site looks like the two reference pages, runs adaptive light/dark, opens with the vision animation once
per session, shows Kai's real work by category, routes every gallery to an inquiry, books through Calendly,
takes a deposit through Stripe, posts contact to Airtable, ranks for the NYC search terms, and loads in
under three seconds on a phone. Photos lead. The design recedes. The photo always wins.
