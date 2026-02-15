# CBTM Monetization + SEO Implementation Plan

## Current State (as of Phase 1 implementation)

### What's been implemented (this PR):
- **Affiliate link tracking** on the CTA button ("This could be the move →")
  - SeatGeek: appends `aid` + `pid` params
  - Eventbrite: appends `aff` param
  - All links: UTM tracking (`utm_source=cbtm_events&utm_medium=referral`)
- **Google Analytics 4** script tag (placeholder measurement ID)
- **Click tracking** via GA4 events:
  - `cta_click` — when user clicks "This could be the move →" (tracks title, venue, genre, source, cost tier)
  - `event_card_click` — when user opens an event card
- **Open Graph + Twitter Card meta tags** for social sharing
- **robots.txt** allowing search engine crawling
- **Improved SEO title and description** on the homepage

### Placeholder IDs to replace:
| Placeholder | Where | How to get it |
|------------|-------|---------------|
| `PLACEHOLDER_SEATGEEK_AID` | `src/App.jsx` line ~169 | Sign up at https://seatgeek.com/partner |
| `PLACEHOLDER_EVENTBRITE_AFF` | `src/App.jsx` line ~170 | Sign up at https://www.eventbrite.com/affiliate (via Impact Radius) |
| `G-PLACEHOLDER` | `index.html` (2 places) | Create property at https://analytics.google.com |

---

## Revenue Phases (ordered by speed-to-revenue)

### Phase 1: Affiliate Revenue (IMPLEMENTED — needs real IDs)
**Revenue model:** Commission on every ticket purchase that originates from a CBTM click.
- SeatGeek: ~5-8% commission per sale
- Eventbrite: varies by program tier
- Zero marginal cost — these clicks are already happening

**To activate:**
1. Sign up for SeatGeek Partner Program
2. Sign up for Eventbrite Affiliate Program
3. Replace placeholder IDs in `src/App.jsx`
4. Create GA4 property and replace `G-PLACEHOLDER` in `index.html`
5. Deploy

### Phase 2: SEO Foundation (next implementation)
**Goal:** Make the site crawlable and indexable to grow organic search traffic.

**Changes needed:**
1. Install `react-router-dom` + `react-helmet-async`
2. Decompose `App.jsx` into route-based components
3. Create SEO-friendly URL structure:
   - `/austin` — city landing page
   - `/austin/tonight` — "things to do in austin tonight"
   - `/austin/this-weekend` — "austin events this weekend"
   - `/austin/free` — "free things to do in austin"
   - `/austin/live-music` — "live music austin"
   - `/austin/comedy` — "comedy shows austin"
   - `/austin/venues/:slug` — venue pages
   - `/austin/events/:slug` — individual event pages
4. Dynamic `<title>`, `<meta>`, OG tags per route via react-helmet-async
5. JSON-LD structured data (Schema.org Event type) for Google rich results
6. Dynamic sitemap via Vercel Serverless Function
7. Optional: `vite-plugin-prerender` for static HTML of top pages

**Why this matters:** Organic search is the #1 traffic source for event discovery. Queries like "things to do in austin tonight" have massive volume. Without routing and proper meta tags, Google can't index individual pages.

### Phase 3: Display Ads (after SEO traffic grows)
**Goal:** In-feed ad placements between event cards.

**Plan:**
1. Apply to **Ezoic** immediately (no minimum traffic)
2. Apply to **Google AdSense** in parallel (needs ~1K+ monthly pageviews)
3. Create `AdSlot` component, insert after every 4th event card
4. Add a `/privacy` page (required for ad network approval)
5. Switch to AdSense once approved (better RPM)

**Alternative networks for early stage:** Media.net, BuySellAds

### Phase 4: Venue Promotion / Boosting
**Goal:** Venues and promoters pay to feature their events.

**Implementation:**
1. Add `is_promoted` + `promotion_tier` columns to Supabase `events` table
2. Display "Featured" badge on promoted events
3. Sort promoted events to top of relevant feeds
4. **Phase 4a (manual):** Create Stripe Payment Link (no-code), add `/promote` page
5. **Phase 4b (self-serve):** Stripe Checkout via Vercel serverless function

**Pricing suggestion:**
| Tier | Price | What you get |
|------|-------|-------------|
| Spotlight | $25/week | "Featured" badge + top of genre feed |
| Homepage Feature | $50/week | Pinned at top of main feed |
| Premium | $100/week | All above + larger card with image in feed |

### Phase 5: SEO Content Play (long-tail traffic)
**Goal:** Auto-generated landing pages targeting high-intent search queries.

**Pages to create:**
- "Best Comedy Shows in Austin This Weekend"
- "Free Events in Austin Tonight"
- "Live Music in Austin This Weekend"
- Venue guide pages
- Neighborhood guide pages

Each page: H1 with target phrase, filtered event list, Schema.org JSON-LD, internal links.

---

## Speed Suggestions

### What ships with zero new dependencies:
- Affiliate link params ✅ (done)
- GA4 ✅ (done)
- Click tracking ✅ (done)
- OG tags ✅ (done)
- robots.txt ✅ (done)

### Minimal Viable SEO (not a full SSR rewrite):
`react-router-dom` + `react-helmet-async` + `vite-plugin-prerender` = 90% of SSR's SEO benefit at 10% of the effort. No Next.js migration needed.

### No-code shortcuts:
- **Stripe Payment Links** for venue promotion (zero backend)
- **Ezoic CDN proxy** can inject ads with minimal code
- **Google Tag Manager** instead of hardcoding tracking scripts

---

## Action Items Checklist

### Immediate (activate revenue)
- [ ] Sign up for SeatGeek Partner Program
- [ ] Sign up for Eventbrite Affiliate Program
- [ ] Create GA4 property at https://analytics.google.com
- [ ] Replace all placeholder IDs
- [ ] Set up Google Search Console at https://search.google.com/search-console
- [ ] Deploy

### Week 1-2 (SEO foundation)
- [ ] Install react-router-dom + react-helmet-async
- [ ] Decompose App.jsx into route-based components
- [ ] Implement URL structure with SEO-friendly routes
- [ ] Add dynamic meta tags per route
- [ ] Add JSON-LD structured data for events
- [ ] Create dynamic sitemap
- [ ] Submit sitemap to Google Search Console

### Week 2-3 (ads)
- [ ] Apply to Ezoic
- [ ] Apply to Google AdSense
- [ ] Add privacy policy page
- [ ] Implement AdSlot component

### Week 3-4 (venue promotion)
- [ ] Add promotion columns to Supabase
- [ ] Create Stripe account
- [ ] Build /promote page with Stripe Payment Link
- [ ] Implement promoted event display treatment
