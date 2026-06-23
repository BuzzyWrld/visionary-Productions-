# Visionary Productions

Portfolio site for **Visionary Productions**, the brand of NYC editorial, event, and
lifestyle photographer **Malachi "Kai" Sydney** ([@kai_photoproductions](https://instagram.com/kai_photoproductions)).
Tagline: *Executing visions by the day.* Photos lead, the design recedes, the site
respects the visitor's light or dark setting. The one metric that matters is booked
sessions per month.

The full product brief lives in [`CLAUDE.md`](./CLAUDE.md). It is the source of truth.

House rule: **zero em-dashes or en-dashes** anywhere in code, copy, or commits.

## Stack

- **Astro 5**, static first, on the **Vercel** adapter (the contact endpoint is the one
  on demand route, everything else is prerendered).
- Motion: **Lenis** smooth scroll + **GSAP** + **ScrollTrigger** + **SplitType**, all via npm.
- **Calendly** embed for booking, **Stripe Payment Link** for deposits, **Beehiiv** for the
  newsletter, all by environment variable.
- Contact form posts to **Airtable** through `src/pages/api/contact.ts`.
- Fonts: Fraunces (display), Work Sans (body), Space Mono (labels).

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build to dist/ + .vercel/output
npm run preview    # preview the static build
```

Node 22 (see `.nvmrc`). Copy `.env.example` to `.env` and fill in the integration values.

## Environment variables

| Key | What it is | Exposed to client |
| --- | --- | --- |
| `PUBLIC_CALENDLY_URL` | Calendly booking embed URL | yes |
| `PUBLIC_STRIPE_DEPOSIT_URL` | Stripe Payment Link for the deposit | yes |
| `PUBLIC_BEEHIIV_EMBED` | Beehiiv newsletter embed URL | yes |
| `AIRTABLE_TOKEN` | Airtable personal access token | **no, server only** |
| `AIRTABLE_BASE` | Airtable base id | no, server only |
| `AIRTABLE_TABLE` | Airtable table name (e.g. `Inquiries`) | no, server only |

Set the same keys in the Vercel project settings before deploying.

## Project layout

```
src/
  components/   Logo, Nav, Footer, Grain, SEO, Reveal
  layouts/      Base.astro (head, fonts, theme, grain, nav, footer, motion)
  pages/        index, portfolio, portfolio/[category], portfolio/[category]/[set],
                services, pricing, contact, clients/[slug], api/contact.ts
  scripts/      motion.ts (Lenis + GSAP loop, reveals, wipes, vision intro)
  styles/       tokens, components, home, portfolio, gallery, content
  data/         portfolio.ts (categories + sets, the gallery data source)
public/images/  placeholder photos until Kai's approved folder lands
```

## How the work gets added

The galleries are data driven. When Kai sends the approved folder:

1. Convert to WebP, around 2048px long edge for galleries, 1600px for the hero.
2. Drop them in and update the `images` and `cover` fields in `src/data/portfolio.ts`,
   with real descriptive alt text for SEO.
3. Tag two or three calm, negative-space frames as hero candidates.

No code changes are needed to add a category, a set, or a photo. It is a data edit.

## Status

Built and verified against the two approved reference pages. What is live in the repo:

- [x] Astro scaffold, tokens, fonts, grain, theme toggle (persisted, no flash), Nav, Footer, SEO, motion
- [x] Home with the once per session vision intro (tap to skip, mobile compressed) and the archive mosaic
- [x] Portfolio: brand story then the four category covers
- [x] Category galleries and set galleries (full bleed scroll), data driven
- [x] Services, Pricing (numbers are placeholders, confirm with Kai), Contact
- [x] Contact endpoint to Airtable, with validation, honeypot, and rate limit
- [x] Client gallery route, gated, hidden and unlinked
- [ ] Kai's real photos (WebP via the Astro image pipeline) and final alt text
- [ ] Real Calendly, Stripe, and Beehiiv values
- [ ] Confirmed pricing numbers
- [ ] Lighthouse pass, sub 3s on mobile, ship

See `CLAUDE.md` section 14 for the full build order and definition of done.
