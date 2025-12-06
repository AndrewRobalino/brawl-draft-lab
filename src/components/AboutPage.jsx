import React from "react";

const creators = [
  {
    id: "carter",
    display: 'Carter "GOAT" B.',
    role: "Sharpshooter / Lane Specialist",
    avatar: "/assets/avatars/draco.jpg",
    favoriteBrawlers: ["piper", "belle", "rico", "mandy", "spike"],
    profileUrl: "https://brawlify.com/stats/profile/2LP2VJG",
  },
  {
    id: "andrew",
    display: 'Andrew "Squadipoo" Robalino',
    role: "Mid / Tank Specialist",
    avatar: "/assets/avatars/frank.webp",
    favoriteBrawlers: ["gus", "meg", "frank", "doug", "bibi"],
    profileUrl: "https://brawlify.com/stats/profile/LL22UY8",
  },
];

export function AboutPage() {
  return (
    <div className="page-grid-single">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">About Brawl Draft Lab</div>
            <div className="card-subtitle">
              A Worlds-style draft helper built for real matches, not just theory.
            </div>
          </div>
          <span className="pill pill-gold">Since Brawl Stars beta (2017)</span>
        </div>
        <p className="section-caption" style={{ marginBottom: 6 }}>
          Brawl Draft Lab started as a shared notes project between Carter and
          Andrew, trying to keep up with drafts from ranked, monthly events and
          Worlds. Instead of scrolling screenshots or spreadsheets in a lobby,
          the idea was to pack everything into one fast, mobile-friendly tool.
        </p>
        <p className="section-caption" style={{ marginBottom: 6 }}>
          Under the hood, the site mixes Worlds-style draft data with simple
          role logic: tanks, sharps, throwers, control and anti-tank options.
          That way you still get useful suggestions even when the meta shifts or
          ranked looks a bit different from esports.
        </p>
        <p className="section-caption">
          Built by Carter and Andrew, powered by an AI assistant, and designed
          to keep your head in the draft instead of in a notes app.
        </p>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Creators</div>
            <div className="card-subtitle">
              Two long-time Brawl players who live in draft lobbies.
            </div>
          </div>
        </div>
        <div className="about-row">
          {creators.map((c, idx) => (
            <article key={c.id} className="about-profile">
              <img src={c.avatar} alt={c.display} className="about-avatar" />
              <div style={{ flex: 1 }}>
                <div className="about-name">{c.display}</div>
                <div className="about-role">{c.role}</div>
                <div className="about-tag-row">
                  {c.favoriteBrawlers.map((bId, i) => (
                    <span
                      key={bId}
                      className={
                        "about-brawler-chip" +
                        (idx === 0 && i === 0
                          ? " primary"
                          : idx === 1 && i === 0
                          ? " primary-gus"
                          : "")
                      }
                    >
                      {bId}
                    </span>
                  ))}
                </div>
                <a
                  href={c.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="about-link"
                >
                  View profile on Brawlify
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">How to use this during drafts</div>
            <div className="card-subtitle">
              Built to be fast, minimal and phone-friendly.
            </div>
          </div>
        </div>
        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: "0.78rem",
            color: "#e5e7eb",
          }}
        >
          <li>Pick the mode and map you&apos;re playing.</li>
          <li>Set whether you have first pick or last pick.</li>
          <li>Lock in all six bans as they happen in the lobby.</li>
          <li>Mirror both your picks and enemy picks as the draft goes.</li>
          <li>
            Use the suggestions as a quick guide, and toggle advanced
            explanations if you want to understand <em>why</em> each pick works.
          </li>
        </ol>
      </section>
    </div>
  );
}
