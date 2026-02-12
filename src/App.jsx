import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// PASTE YOUR SUPABASE CREDENTIALS HERE
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL = "https://qxgdyoysvfmiyunfmonp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dKVknFIVrXbIfZXpOUOJ3g_XYs-nBlS";
// ═══════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "music", label: "Music", emoji: "♫" },
  { id: "food", label: "Food & Drink", emoji: "🍸" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "arts", label: "Arts", emoji: "🎭" },
  { id: "outdoors", label: "Outdoors", emoji: "☀" },
  { id: "sports", label: "Sports", emoji: "⚡" },
];

const DATE_FILTERS = [
  { id: "tonight", label: "Tonight" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This Weekend" },
  { id: "week", label: "This Week" },
];

const ACCENT = "#E8FF5A";
const BG = "#0A0A0F";
const CARD_BG = "#141420";
const CARD_BORDER = "#1E1E30";
const TEXT_PRIMARY = "#F0F0F5";
const TEXT_SECONDARY = "#8888A0";
const TEXT_MUTED = "#555570";

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff9a9e 100%)",
];

function getGradient(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getDateRange(filter) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  switch (filter) {
    case "tonight":
      return { start: now.toISOString(), end: tomorrow.toISOString() };
    case "tomorrow":
      return { start: tomorrow.toISOString(), end: dayAfterTomorrow.toISOString() };
    case "weekend": {
      const day = now.getDay();
      const daysUntilFri = day <= 5 ? 5 - day : 0;
      const friday = new Date(today);
      friday.setDate(friday.getDate() + daysUntilFri);
      const monday = new Date(friday);
      monday.setDate(monday.getDate() + 3);
      return { start: friday.toISOString(), end: monday.toISOString() };
    }
    case "week": {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return { start: now.toISOString(), end: weekEnd.toISOString() };
    }
    default:
      return { start: now.toISOString(), end: tomorrow.toISOString() };
  }
}

async function fetchEvents(dateFilter, category) {
  const { start, end } = getDateRange(dateFilter);

  let url = `${SUPABASE_URL}/rest/v1/events?date_start=gte.${start}&date_start=lt.${end}&order=date_start.asc&limit=50`;

  if (category && category !== "all") {
    url += `&category=eq.${category}`;
  }

  try {
    const resp = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CbtmEvents() {
  const [activeDate, setActiveDate] = useState("tonight");
  const [activeCategory, setActiveCategory] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchEvents(activeDate, activeCategory).then((data) => {
      if (!cancelled) {
        setEvents(data);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [activeDate, activeCategory]);

  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      color: TEXT_PRIMARY,
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .date-pill {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid ${CARD_BORDER};
          background: transparent;
          color: ${TEXT_SECONDARY};
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          letter-spacing: 0.02em;
          font-family: 'DM Sans', sans-serif;
        }
        .date-pill:hover {
          border-color: ${ACCENT};
          color: ${TEXT_PRIMARY};
        }
        .date-pill.active {
          background: ${ACCENT};
          color: ${BG};
          border-color: ${ACCENT};
        }
        
        .cat-btn {
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          border: none;
          background: transparent;
          color: ${TEXT_MUTED};
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cat-btn:hover {
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
        }
        .cat-btn.active {
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
          border: 1px solid ${CARD_BORDER};
        }
        
        .event-card {
          background: ${CARD_BG};
          border: 1px solid ${CARD_BORDER};
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .event-card:hover {
          transform: translateY(-4px);
          border-color: #2a2a45;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: ${CARD_BG};
          border: 1px solid ${CARD_BORDER};
          border-radius: 24px 24px 0 0;
          max-width: 500px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          animation: slideIn 0.3s ease;
        }

        .scroll-row {
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-row::-webkit-scrollbar { display: none; }

        .skeleton {
          background: linear-gradient(90deg, ${CARD_BG} 25%, #1a1a2e 50%, ${CARD_BG} 75%);
          background-size: 200% 100%;
          animation: pulse 1.5s ease-in-out infinite;
          border-radius: 16px;
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "-200px", right: "-200px",
        width: "600px", height: "600px",
        background: `radial-gradient(circle, ${ACCENT}15 0%, transparent 70%)`,
        animation: "glow 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-300px", left: "-200px",
        width: "700px", height: "700px",
        background: "radial-gradient(circle, #FF336615 0%, transparent 70%)",
        animation: "glow 5s ease-in-out infinite 1s",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <header style={{
        padding: "20px 20px 0",
        maxWidth: "800px",
        margin: "0 auto",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.6s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              <span style={{ color: ACCENT }}>cbtm</span>
              <span style={{ color: TEXT_MUTED }}>.events</span>
            </h1>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: TEXT_MUTED,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "4px",
            }}>could be the move</p>
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: TEXT_SECONDARY,
            textAlign: "right",
            letterSpacing: "0.05em",
          }}>
            <span style={{ color: ACCENT }}>●</span> Austin, TX
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 20px" }}>
        {/* Date Filters */}
        <div className="scroll-row" style={{
          display: "flex", gap: "10px", marginBottom: "20px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          {DATE_FILTERS.map((d) => (
            <button
              key={d.id}
              className={`date-pill ${activeDate === d.id ? "active" : ""}`}
              onClick={() => setActiveDate(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="scroll-row" style={{
          display: "flex", gap: "4px", marginBottom: "28px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s ease 0.15s",
        }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cat-btn ${activeCategory === c.id ? "active" : ""}`}
              onClick={() => setActiveCategory(c.id)}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "16px",
          opacity: loaded ? 1 : 0,
          transition: "all 0.6s ease 0.2s",
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px",
            color: TEXT_MUTED,
            letterSpacing: "0.05em",
          }}>
            {loading ? "loading..." : `${events.length} event${events.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: "260px", border: `1px solid ${CARD_BORDER}` }} />
            ))}
          </div>
        )}

        {/* Event Grid */}
        {!loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {events.map((event, i) => (
              <div
                key={event.id || i}
                className="event-card"
                onClick={() => setSelectedEvent(event)}
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(24px)",
                  transition: `all 0.5s ease ${0.05 + i * 0.04}s`,
                }}
              >
                {/* Image area */}
                <div style={{
                  height: "140px",
                  background: event.image_url
                    ? `url(${event.image_url}) center/cover no-repeat`
                    : getGradient(event.title),
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "'Space Mono', monospace",
                    color: "white",
                    letterSpacing: "0.03em",
                  }}>
                    {event.time_display || formatTime(event.date_start)}
                  </div>
                  {event.price && (
                    <div style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(8px)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontFamily: "'Space Mono', monospace",
                      color: ACCENT,
                      letterSpacing: "0.03em",
                    }}>
                      {event.price}
                    </div>
                  )}
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: ACCENT,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    {event.category}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "16px" }}>
                  <h3 style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {event.title}
                  </h3>
                  {event.description && (
                    <p style={{
                      fontSize: "13px",
                      color: TEXT_SECONDARY,
                      marginBottom: "10px",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {event.description}
                    </p>
                  )}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{
                      fontSize: "12px",
                      color: TEXT_MUTED,
                      fontFamily: "'Space Mono', monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "60%",
                    }}>
                      📍 {event.venue}
                    </span>
                    {event.neighborhood && (
                      <span style={{
                        fontSize: "10px",
                        color: TEXT_MUTED,
                        background: "#1a1a2e",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}>
                        {event.neighborhood}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: TEXT_MUTED,
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🤷</div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px" }}>
              Nothing here yet. Try a different filter.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "40px 20px 24px",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${CARD_BORDER}, transparent)`,
          marginBottom: "20px",
        }} />
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          color: TEXT_MUTED,
          letterSpacing: "0.05em",
        }}>
          cbtm.events — Austin, TX — {new Date().getFullYear()}
        </p>
      </footer>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{
              height: "200px",
              background: selectedEvent.image_url
                ? `url(${selectedEvent.image_url}) center/cover no-repeat`
                : getGradient(selectedEvent.title),
              position: "relative",
            }}>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                  border: "none", color: "white", width: "36px", height: "36px",
                  borderRadius: "50%", cursor: "pointer", fontSize: "18px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <h2 style={{
                fontSize: "24px", fontWeight: 700, marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}>
                {selectedEvent.title}
              </h2>
              {selectedEvent.description && (
                <p style={{
                  fontSize: "14px", color: TEXT_SECONDARY, lineHeight: 1.6,
                  marginBottom: "20px",
                }}>
                  {selectedEvent.description}
                </p>
              )}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: "12px", marginBottom: "24px",
              }}>
                {[
                  { label: "When", value: `${formatDate(selectedEvent.date_start)} · ${selectedEvent.time_display || formatTime(selectedEvent.date_start)}` },
                  { label: "Price", value: selectedEvent.price || "See event" },
                  { label: "Where", value: selectedEvent.venue },
                  { label: "Area", value: selectedEvent.neighborhood || "Austin" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "#0d0d18", borderRadius: "12px", padding: "12px",
                  }}>
                    <div style={{
                      fontSize: "10px", color: TEXT_MUTED,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      marginBottom: "4px", fontFamily: "'Space Mono', monospace",
                    }}>{item.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {selectedEvent.source_url && (
                <a
                  href={selectedEvent.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%", padding: "16px",
                    background: ACCENT, color: BG,
                    border: "none", borderRadius: "14px",
                    fontSize: "15px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.02em",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  This could be the move →
                </a>
              )}
              <p style={{
                textAlign: "center",
                marginTop: "12px",
                fontSize: "11px",
                color: TEXT_MUTED,
                fontFamily: "'Space Mono', monospace",
              }}>
                via {selectedEvent.source}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
