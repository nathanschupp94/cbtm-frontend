import { useState, useEffect } from "react";

const SUPABASE_URL = "https://qxgdyoysvfmiyunfmonp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dKVknFIVrXbIfZXpOUOJ3g_XYs-nBlS";

// ── Design Tokens ────────────────────────────────────────
const BG = "#08080f";
const CARD_BG = "#111120";
const CARD_BORDER = "#1a1a2e";
const ACCENT = "#E8FF5A";
const ACCENT_DIM = "rgba(232, 255, 90, 0.12)";
const ACCENT_GLOW = "rgba(232, 255, 90, 0.25)";
const TEXT_PRIMARY = "#f0f0f5";
const TEXT_SECONDARY = "#9999aa";
const TEXT_MUTED = "#555566";

// ── Genre Definitions ────────────────────────────────────
const GENRES = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "live_music", label: "Live Music", emoji: "🎸" },
  { id: "dj_electronic", label: "DJ/Electronic", emoji: "🎧" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "theater", label: "Theater", emoji: "🎭" },
  { id: "film", label: "Film", emoji: "🎬" },
  { id: "art_gallery", label: "Art/Gallery", emoji: "🎨" },
  { id: "food_drink", label: "Food & Drink", emoji: "🍸" },
  { id: "festival", label: "Festival", emoji: "🎪" },
  { id: "market_popup", label: "Market/Pop-up", emoji: "🛍️" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "fitness_wellness", label: "Fitness", emoji: "🏃" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "networking", label: "Networking", emoji: "🤝" },
];

// ── Sub-Genre Definitions ────────────────────────────────
const SUB_GENRES = {
  live_music: [
    { id: "rock", label: "Rock" },
    { id: "country", label: "Country" },
    { id: "hip_hop_rnb", label: "Hip-Hop/R&B" },
    { id: "jazz_blues", label: "Jazz/Blues" },
    { id: "indie_alt", label: "Indie/Alt" },
    { id: "folk_americana", label: "Folk/Americana" },
    { id: "latin_reggae", label: "Latin/Reggae" },
    { id: "metal_punk", label: "Metal/Punk" },
    { id: "singer_songwriter", label: "Singer-Songwriter" },
    { id: "pop", label: "Pop" },
  ],
  dj_electronic: [
    { id: "house", label: "House" },
    { id: "techno", label: "Techno" },
    { id: "edm_bass", label: "EDM/Bass" },
    { id: "dnb", label: "Drum & Bass" },
    { id: "ambient_experimental", label: "Ambient/Exp." },
    { id: "dj_night", label: "DJ Night" },
  ],
  comedy: [
    { id: "standup", label: "Stand-Up" },
    { id: "improv", label: "Improv" },
    { id: "sketch", label: "Sketch" },
    { id: "open_mic", label: "Open Mic" },
    { id: "variety_show", label: "Variety" },
  ],
  theater: [
    { id: "musical", label: "Musical" },
    { id: "play_drama", label: "Play/Drama" },
    { id: "dance_ballet", label: "Dance/Ballet" },
    { id: "opera", label: "Opera" },
    { id: "immersive", label: "Immersive" },
  ],
  film: [
    { id: "screening", label: "Screening" },
    { id: "documentary", label: "Documentary" },
    { id: "drive_in", label: "Drive-In" },
    { id: "film_festival", label: "Film Festival" },
  ],
  art_gallery: [
    { id: "exhibition", label: "Exhibition" },
    { id: "gallery_opening", label: "Gallery Opening" },
    { id: "museum", label: "Museum" },
    { id: "literary_poetry", label: "Literary/Poetry" },
    { id: "photography", label: "Photography" },
  ],
  food_drink: [
    { id: "tasting_pairing", label: "Tasting/Pairing" },
    { id: "brewery_tap", label: "Brewery/Tap" },
    { id: "brunch_event", label: "Brunch Event" },
    { id: "food_festival", label: "Food Festival" },
    { id: "cocktail_event", label: "Cocktail Event" },
  ],
  festival: [
    { id: "music_festival", label: "Music Festival" },
    { id: "cultural_festival", label: "Cultural Festival" },
    { id: "block_party", label: "Block Party" },
    { id: "holiday_event", label: "Holiday Event" },
  ],
  market_popup: [
    { id: "farmers_market", label: "Farmers Market" },
    { id: "craft_flea", label: "Craft/Flea" },
    { id: "popup_shop", label: "Pop-Up Shop" },
    { id: "vendor_market", label: "Vendor Market" },
  ],
  sports: [
    { id: "pro_soccer", label: "Austin FC" },
    { id: "college_football", label: "College Football" },
    { id: "college_basketball", label: "College BBall" },
    { id: "pro_racing", label: "F1/Racing" },
    { id: "minor_league_baseball", label: "Minor League" },
    { id: "esports", label: "Esports" },
    { id: "other_sports", label: "Other" },
  ],
  fitness_wellness: [
    { id: "yoga", label: "Yoga" },
    { id: "running_5k", label: "Running/5K" },
    { id: "cycling", label: "Cycling" },
    { id: "meditation_wellness", label: "Meditation" },
    { id: "group_fitness", label: "Group Fitness" },
  ],
  family: [
    { id: "kids_activities", label: "Kids Activities" },
    { id: "all_ages_show", label: "All-Ages Show" },
    { id: "outdoor_family", label: "Outdoor Family" },
    { id: "educational", label: "Educational" },
  ],
  networking: [
    { id: "tech_startup", label: "Tech/Startup" },
    { id: "professional_mixer", label: "Pro Mixer" },
    { id: "workshop_seminar", label: "Workshop" },
    { id: "conference", label: "Conference" },
  ],
};

// ── Date Helpers ─────────────────────────────────────────
const DATES = (() => {
  const d = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() + i);
    const iso = dt.toISOString().slice(0, 10);
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow"
      : dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    d.push({ iso, label });
  }
  return d;
})();

const SIZE_OPTIONS = [
  { id: "all", label: "Any Size" },
  { id: "xs", label: "XS", desc: "Intimate" },
  { id: "s", label: "S", desc: "Small" },
  { id: "m", label: "M", desc: "Medium" },
  { id: "l", label: "L", desc: "Large" },
  { id: "xl", label: "XL", desc: "Massive" },
];

const COST_OPTIONS = [
  { id: "all", label: "Any Price" },
  { id: "free", label: "Free" },
  { id: "$", label: "$", desc: "<$20" },
  { id: "$$", label: "$$", desc: "$20–50" },
  { id: "$$$", label: "$$$", desc: "$50–100" },
  { id: "$$$$", label: "$$$$", desc: "$100+" },
];

// ── Affiliate Links ─────────────────────────────────────
// TODO: Replace these placeholder IDs with real ones once approved:
//   SeatGeek Partner Program: https://seatgeek.com/partner
//   Eventbrite Affiliate (via Impact Radius): https://www.eventbrite.com/affiliate
const SEATGEEK_AID = "PLACEHOLDER_SEATGEEK_AID";
const EVENTBRITE_AFF = "PLACEHOLDER_EVENTBRITE_AFF";

function buildAffiliateUrl(sourceUrl, source) {
  if (!sourceUrl) return null;
  try {
    const url = new URL(sourceUrl);
    if (source === "seatgeek" || url.hostname.includes("seatgeek.com")) {
      url.searchParams.set("aid", SEATGEEK_AID);
      url.searchParams.set("pid", "cbtm_events");
    } else if (source === "eventbrite" || url.hostname.includes("eventbrite.com")) {
      url.searchParams.set("aff", EVENTBRITE_AFF);
    }
    url.searchParams.set("utm_source", "cbtm_events");
    url.searchParams.set("utm_medium", "referral");
    return url.toString();
  } catch {
    return sourceUrl;
  }
}

// ── Analytics ───────────────────────────────────────────
function trackEvent(eventName, params) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

function trackCtaClick(event) {
  trackEvent("cta_click", {
    event_title: event.title,
    event_venue: event.venue,
    event_genre: event.genre,
    event_source: event.source,
    event_cost_tier: event.cost_tier,
  });
}

function trackCardOpen(event) {
  trackEvent("event_card_click", {
    event_title: event.title,
    event_genre: event.genre,
    event_venue: event.venue,
  });
}

// ── Supabase Fetch ──────────────────────────────────────
async function fetchEvents(date, genre, subGenre, size, cost) {
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
  const nextDay = new Date(date + "T00:00:00");
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().slice(0, 10);

  let url = `${SUPABASE_URL}/rest/v1/events?select=*&date_start=gte.${date}T00:00:00&date_start=lt.${nextDayStr}T00:00:00&order=date_start.asc`;

  if (genre && genre !== "all") url += `&genre=eq.${genre}`;
  if (subGenre && subGenre !== "all") url += `&sub_genre=eq.${subGenre}`;
  if (size && size !== "all") url += `&venue_size=eq.${size}`;
  if (cost && cost !== "all") url += `&cost_tier=eq.${cost}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.error("Fetch error:", e);
    return [];
  }
}

// ── App ─────────────────────────────────────────────────
export default function App() {
  const [activeDate, setActiveDate] = useState(DATES[0].iso);
  const [activeGenre, setActiveGenre] = useState("all");
  const [activeSubGenre, setActiveSubGenre] = useState("all");
  const [activeSize, setActiveSize] = useState("all");
  const [activeCost, setActiveCost] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [activeSize, activeCost].filter(f => f !== "all").length
    + (activeSubGenre !== "all" ? 1 : 0);

  const currentSubGenres = activeGenre !== "all" ? SUB_GENRES[activeGenre] || [] : [];

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchEvents(activeDate, activeGenre, activeSubGenre, activeSize, activeCost).then((data) => {
      if (!cancelled) { setEvents(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [activeDate, activeGenre, activeSubGenre, activeSize, activeCost]);

  // When genre changes, reset sub-genre
  const handleGenreChange = (genreId) => {
    if (genreId === activeGenre) {
      // Tapping same genre again → deselect (go to "all")
      setActiveGenre("all");
      setActiveSubGenre("all");
    } else {
      setActiveGenre(genreId);
      setActiveSubGenre("all");
    }
  };

  const handleSubGenreChange = (subId) => {
    setActiveSubGenre(subId === activeSubGenre ? "all" : subId);
  };

  const clearAllFilters = () => {
    setActiveGenre("all");
    setActiveSubGenre("all");
    setActiveSize("all");
    setActiveCost("all");
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT_PRIMARY, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes subGenreSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .date-pill {
          padding: 10px 20px; border-radius: 100px; font-size: 14px; font-weight: 600;
          border: 1px solid ${CARD_BORDER}; background: transparent; color: ${TEXT_SECONDARY};
          cursor: pointer; transition: all 0.25s ease; white-space: nowrap;
          letter-spacing: 0.02em; font-family: 'DM Sans', sans-serif;
        }
        .date-pill:hover { border-color: ${ACCENT}; color: ${TEXT_PRIMARY}; }
        .date-pill.active { background: ${ACCENT}; color: ${BG}; border-color: ${ACCENT}; font-weight: 700; }

        .genre-chip {
          padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 600;
          border: 1px solid ${CARD_BORDER}; background: transparent; color: ${TEXT_SECONDARY};
          cursor: pointer; transition: all 0.25s ease; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .genre-chip:hover { border-color: ${ACCENT}; color: ${TEXT_PRIMARY}; }
        .genre-chip.active { background: ${ACCENT_DIM}; color: ${ACCENT}; border-color: ${ACCENT}; font-weight: 700; }

        .sub-genre-chip {
          padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 500;
          border: 1px solid ${CARD_BORDER}; background: transparent; color: ${TEXT_MUTED};
          cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .sub-genre-chip:hover { border-color: ${ACCENT}; color: ${TEXT_SECONDARY}; }
        .sub-genre-chip.active { background: ${ACCENT}; color: ${BG}; border-color: ${ACCENT}; font-weight: 700; }

        .filter-chip {
          padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 500;
          border: 1px solid ${CARD_BORDER}; background: transparent; color: ${TEXT_SECONDARY};
          cursor: pointer; transition: all 0.2s ease;
        }
        .filter-chip:hover { border-color: ${ACCENT}; }
        .filter-chip.active { background: ${ACCENT_DIM}; color: ${ACCENT}; border-color: ${ACCENT}; font-weight: 600; }

        .event-card {
          background: ${CARD_BG}; border: 1px solid ${CARD_BORDER}; border-radius: 16px;
          padding: 16px; cursor: pointer; transition: all 0.3s ease;
        }
        .event-card:hover { border-color: rgba(232, 255, 90, 0.3); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3); }

        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Background Glow ─── */}
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px",
        background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, transparent 70%)`,
        animation: "glow 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", padding: "0 16px",
        opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}>

        {/* ── Header ─── */}
        <header style={{ paddingTop: 20, paddingBottom: 8, textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, letterSpacing: "0.08em" }}>
            <span style={{ color: ACCENT }}>CBTM</span>
            <span style={{ color: TEXT_MUTED }}>.EVENTS</span>
          </h1>
          <p style={{ fontSize: 12, color: TEXT_MUTED, fontFamily: "'Space Mono', monospace", marginTop: 4, letterSpacing: "0.05em" }}>
            AUSTIN — COULD BE THE MOVE
          </p>
        </header>

        {/* ── Date Row ─── */}
        <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0" }}>
          {DATES.map((d) => (
            <button key={d.iso} className={`date-pill ${activeDate === d.iso ? "active" : ""}`}
              onClick={() => setActiveDate(d.iso)}>
              {d.label}
            </button>
          ))}
        </div>

        {/* ── Genre Row ─── */}
        <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "6px 0" }}>
          {GENRES.map((g) => (
            <button key={g.id} className={`genre-chip ${activeGenre === g.id ? "active" : ""}`}
              onClick={() => handleGenreChange(g.id)}>
              <span style={{ marginRight: 4 }}>{g.emoji}</span> {g.label}
            </button>
          ))}
        </div>

        {/* ── Sub-Genre Row (appears when a genre is selected) ─── */}
        {currentSubGenres.length > 0 && (
          <div className="scrollbar-hide" style={{
            display: "flex", gap: 6, overflowX: "auto", padding: "6px 0",
            animation: "subGenreSlide 0.25s ease-out",
          }}>
            <button
              className={`sub-genre-chip ${activeSubGenre === "all" ? "active" : ""}`}
              onClick={() => setActiveSubGenre("all")}
              style={activeSubGenre === "all" ? { background: ACCENT_DIM, color: ACCENT, borderColor: ACCENT } : {}}
            >
              All {GENRES.find(g => g.id === activeGenre)?.label}
            </button>
            {currentSubGenres.map((sg) => (
              <button key={sg.id} className={`sub-genre-chip ${activeSubGenre === sg.id ? "active" : ""}`}
                onClick={() => handleSubGenreChange(sg.id)}>
                {sg.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Filters Toggle ─── */}
        <div style={{ display: "flex", gap: 8, padding: "8px 0", alignItems: "center" }}>
          <button onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600,
              border: `1px solid ${activeFilterCount > 0 ? ACCENT : CARD_BORDER}`,
              background: activeFilterCount > 0 ? ACCENT_DIM : "transparent",
              color: activeFilterCount > 0 ? ACCENT : TEXT_SECONDARY,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            ⚙ Filters
            {activeFilterCount > 0 && (
              <span style={{
                background: ACCENT, color: BG, borderRadius: "50%",
                width: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{activeFilterCount}</span>
            )}
          </button>
          {(activeFilterCount > 0 || activeGenre !== "all") && (
            <button onClick={clearAllFilters}
              style={{
                padding: "8px 14px", borderRadius: 100, fontSize: 12,
                border: "none", background: "rgba(255,80,80,0.15)", color: "#ff6666",
                cursor: "pointer", fontWeight: 600,
              }}>
              Clear all
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: TEXT_MUTED, fontFamily: "'Space Mono', monospace" }}>
            {loading ? "..." : `${events.length} events`}
          </span>
        </div>

        {/* ── Filters Panel ─── */}
        {showFilters && (
          <div style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 16,
            padding: 16, marginBottom: 12, animation: "subGenreSlide 0.2s ease-out",
          }}>
            {/* Venue Size */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: "'Space Mono', monospace",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Venue Size
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SIZE_OPTIONS.map((s) => (
                  <button key={s.id} className={`filter-chip ${activeSize === s.id ? "active" : ""}`}
                    onClick={() => setActiveSize(s.id)}>
                    {s.label} {s.desc && <span style={{ opacity: 0.6 }}>({s.desc})</span>}
                  </button>
                ))}
              </div>
            </div>
            {/* Cost Tier */}
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: "'Space Mono', monospace",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Price
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {COST_OPTIONS.map((c) => (
                  <button key={c.id} className={`filter-chip ${activeCost === c.id ? "active" : ""}`}
                    onClick={() => setActiveCost(c.id)}>
                    {c.label} {c.desc && <span style={{ opacity: 0.6 }}>({c.desc})</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Event List ─── */}
        <div style={{ paddingBottom: 80 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  background: CARD_BG, borderRadius: 16, height: 120,
                  border: `1px solid ${CARD_BORDER}`, animation: "pulse 1.5s ease-in-out infinite",
                }} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
              <p style={{ color: TEXT_SECONDARY, fontSize: 15, fontWeight: 500 }}>
                Nothing here yet
              </p>
              <p style={{ color: TEXT_MUTED, fontSize: 13, marginTop: 6 }}>
                Try a different date or clear your filters
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
              {events.map((event, idx) => (
                <div key={event.event_hash || idx} className="event-card"
                  onClick={() => { setSelectedEvent(event); trackCardOpen(event); }}
                  style={{ animationDelay: `${idx * 0.04}s`, animation: "fadeIn 0.4s ease forwards", opacity: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 4,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: 13, color: TEXT_SECONDARY }}>
                        {event.venue}
                        {event.neighborhood && <span style={{ color: TEXT_MUTED }}> · {event.neighborhood}</span>}
                      </p>
                    </div>
                    {event.time_display && (
                      <span style={{
                        fontFamily: "'Space Mono', monospace", fontSize: 12, color: ACCENT,
                        fontWeight: 700, whiteSpace: "nowrap", marginLeft: 12,
                      }}>
                        {event.time_display}
                      </span>
                    )}
                  </div>
                  {/* Badges row */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {event.genre && (
                      <span style={{
                        fontSize: 10, fontFamily: "'Space Mono', monospace", padding: "3px 8px",
                        borderRadius: 100, background: ACCENT_DIM, color: ACCENT,
                        fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>
                        {GENRES.find(g => g.id === event.genre)?.label || event.genre}
                      </span>
                    )}
                    {event.sub_genre && (
                      <span style={{
                        fontSize: 10, fontFamily: "'Space Mono', monospace", padding: "3px 8px",
                        borderRadius: 100, background: "rgba(255,255,255,0.06)", color: TEXT_SECONDARY,
                        fontWeight: 500, letterSpacing: "0.03em",
                      }}>
                        {/* Find the sub-genre label */}
                        {(SUB_GENRES[event.genre] || []).find(sg => sg.id === event.sub_genre)?.label || event.sub_genre}
                      </span>
                    )}
                    {event.venue_size && (
                      <span style={{
                        fontSize: 10, fontFamily: "'Space Mono', monospace", padding: "3px 8px",
                        borderRadius: 100, border: `1px solid ${CARD_BORDER}`, color: TEXT_MUTED,
                        fontWeight: 600,
                      }}>
                        {event.venue_size.toUpperCase()}
                      </span>
                    )}
                    {event.cost_tier && (
                      <span style={{
                        fontSize: 10, fontFamily: "'Space Mono', monospace", padding: "3px 8px",
                        borderRadius: 100, border: `1px solid ${CARD_BORDER}`, color: TEXT_MUTED,
                        fontWeight: 600,
                      }}>
                        {event.cost_tier === "free" ? "FREE" : event.cost_tier}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Event Detail Modal ─── */}
      {selectedEvent && (
        <div onClick={() => setSelectedEvent(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{
              background: CARD_BG, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 520,
              maxHeight: "85vh", overflowY: "auto", padding: "24px 20px 32px",
              border: `1px solid ${CARD_BORDER}`, borderBottom: "none",
              animation: "slideIn 0.35s ease",
            }}>
            {/* Drag handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: TEXT_MUTED,
              margin: "0 auto 20px", opacity: 0.4 }} />

            {/* Image */}
            {selectedEvent.image_url && (
              <div style={{
                borderRadius: 16, overflow: "hidden", marginBottom: 16, height: 180,
                background: `url(${selectedEvent.image_url}) center/cover no-repeat`,
              }} />
            )}

            {/* Title + genre */}
            <h2 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3, marginBottom: 6 }}>
              {selectedEvent.title}
            </h2>

            {/* Badges */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {selectedEvent.genre && (
                <span style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 100,
                  background: ACCENT_DIM, color: ACCENT, fontWeight: 600,
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {GENRES.find(g => g.id === selectedEvent.genre)?.label || selectedEvent.genre}
                </span>
              )}
              {selectedEvent.sub_genre && (
                <span style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 100,
                  background: "rgba(255,255,255,0.06)", color: TEXT_SECONDARY, fontWeight: 500,
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {(SUB_GENRES[selectedEvent.genre] || []).find(sg => sg.id === selectedEvent.sub_genre)?.label || selectedEvent.sub_genre}
                </span>
              )}
              {selectedEvent.venue_size && (
                <span style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 100,
                  border: `1px solid ${CARD_BORDER}`, color: TEXT_MUTED, fontWeight: 600,
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {selectedEvent.venue_size.toUpperCase()} venue
                </span>
              )}
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <p style={{ fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6, marginBottom: 16 }}>
                {selectedEvent.description.slice(0, 300)}
                {selectedEvent.description.length > 300 && "..."}
              </p>
            )}

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {[
                { label: "When", value: selectedEvent.time_display || "See event" },
                { label: "Price", value: selectedEvent.price || (selectedEvent.cost_tier === "free" ? "Free" : "See event") },
                { label: "Where", value: selectedEvent.venue },
                { label: "Area", value: selectedEvent.neighborhood || "Austin" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#0d0d18", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase",
                    letterSpacing: "0.1em", marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {selectedEvent.source_url && (
              <a href={buildAffiliateUrl(selectedEvent.source_url, selectedEvent.source)}
                target="_blank" rel="noopener noreferrer"
                onClick={() => trackCtaClick(selectedEvent)}
                style={{
                  display: "block", width: "100%", padding: 16, background: ACCENT, color: BG,
                  border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.02em", textAlign: "center", textDecoration: "none",
                }}>
                This could be the move →
              </a>
            )}
            <p style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: TEXT_MUTED,
              fontFamily: "'Space Mono', monospace" }}>
              via {selectedEvent.source}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
