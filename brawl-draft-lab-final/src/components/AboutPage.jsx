import React from "react";

const creators = [
  {
    id: "carter",
    display: "Carter \"GOAT\" B.",
    role: "Sharpshooter / Lane Specialist",
    avatar: "/assets/draco.jpg",
    favoriteBrawlers: ["piper", "belle", "mandy", "rico", "spike"],
    profileUrl: "https://brawlify.com/stats/profile/2LP2VJG",
  },
  {
    id: "andrew",
    display: "Andrew \"Squadipoo\" Robalino",
    role: "Mid / Tank Specialist",
    avatar: "/assets/frank.webp",
    favoriteBrawlers: ["gus", "meg", "frank", "doug", "bibi"],
    profileUrl: "https://brawlify.com/stats/profile/LL22UY8",
  },
];

export function AboutPage() {
  return (
    <main className="app-main">
      <section className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">About Brawl Draft Lab</div>
            <div className="section-subtitle">
              Built by two long-time Brawl players to make drafting faster, cleaner, and smarter.
            </div>
          </div>
          <div className="badge-row">
            <span className="chip chip-blue">Since Brawl Stars beta (2017)</span>
            <span className="chip chip-muted">Designed to be mobile-friendly</span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#e5e7eb", margin: 0 }}>
          Brawl Draft Lab was created by Carter and Andrew as a lightweight tool you can actually use
          during drafts. Instead of scrolling a giant tier list or searching Discord screenshots, you
          can open this site, lock in bans and picks, and quickly see suggestions that are grounded in
          recent high-level play plus simple role logic.
        </p>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
          Under the hood, the tool blends draft data from recent Worlds-style matches with basic
          heuristics around tanks, sharpshooters, throwers, control, and anti-tank options, so you
          still get useful recommendations even when the meta shifts or ladder drafts look different
          from stage drafts.
        </p>
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 10 }}>
          Powered by Carter, Andrew, and a whole lot of notes — with a little help from an AI assistant.
        </p>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div className="section-title">Creators</div>
        </div>
        <div className="stack">
          {creators.map((c, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={c.id}
                className="section-card"
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: isPrimary
                    ? "1px solid rgba(59,130,246,0.9)"
                    : "1px solid rgba(148,163,184,0.6)",
                  background: isPrimary
                    ? "radial-gradient(circle at top left, rgba(59,130,246,0.3), #020617)"
                    : "radial-gradient(circle at top left, rgba(30,64,175,0.2), #020617)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: -2,
                        borderRadius: "999px",
                        background: isPrimary
                          ? "conic-gradient(from 180deg, #f97316, #eab308, #22c55e, #0ea5e9, #6366f1, #f97316)"
                          : "radial-gradient(circle at top left, rgba(59,130,246,0.6), rgba(15,23,42,0.9))",
                        opacity: 0.7,
                        filter: "blur(10px)",
                      }}
                    />
                    <img
                      src={c.avatar}
                      alt={c.display}
                      style={{
                        position: "relative",
                        width: 54,
                        height: 54,
                        borderRadius: "999px",
                        objectFit: "cover",
                        boxShadow: "0 12px 26px rgba(15,23,42,0.9)",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {c.display}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                        }}
                      >
                        {c.role}
                      </span>
                    </div>
                    <a
                      href={c.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 11,
                        color: "#38bdf8",
                        textDecoration: "none",
                      }}
                    >
                      View profile on Brawlify
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#d1d5db",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "#9ca3af",
                      marginBottom: 4,
                    }}
                  >
                    Signature brawlers
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {c.favoriteBrawlers.map((id, i) => (
                      <div
                        key={id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: 42,
                            height: 42,
                            borderRadius: 14,
                            padding: 2,
                            background:
                              i === 0
                                ? "linear-gradient(135deg, #60a5fa, #facc15)"
                                : "linear-gradient(135deg, rgba(148,163,184,0.8), rgba(15,23,42,1))",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              inset: 2,
                              borderRadius: 12,
                              background:
                                "radial-gradient(circle at top left, rgba(15,23,42,0.95), rgba(15,23,42,1))",
                            }}
                          />
                          <img
                            src={`/assets/brawlers/${id}.webp`}
                            alt={id}
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              borderRadius: 12,
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#e5e7eb",
                            textTransform: "capitalize",
                          }}
                        >
                          {id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
