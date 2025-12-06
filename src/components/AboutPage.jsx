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
    <div className="page">
      <div className="page-header">
        <h1>About Brawl Draft Lab</h1>
        <p className="page-subtitle">
          A Worlds-style draft helper built for real matches, not just theory.
        </p>
      </div>

      <section className="section-card">
        <h2>Since Brawl Stars beta (2017)</h2>
        <p>
          Brawl Draft Lab started as a shared notes project between Carter and
          Andrew, trying to keep up with drafts from ranked, monthly events and
          Worlds. Instead of scrolling screenshots or spreadsheets in a lobby,
          the idea was to pack everything into one fast, mobile-friendly tool.
        </p>
        <p>
          Under the hood, the site mixes Worlds-style draft data with simple
          role logic: tanks, sharps, throwers, control and anti-tank options.
          That way you still get useful suggestions even when the meta shifts or
          ranked looks a bit different from esports.
        </p>
        <p>
          Built by Carter and Andrew, powered by an AI assistant, and designed
          to keep your head in the draft instead of in a notes app.
        </p>
      </section>

      <section className="section-card">
        <h2>Creators</h2>
        <p className="muted">
          Two long-time Brawl players who live in draft lobbies.
        </p>

        <div className="creator-grid">
          {creators.map((c) => (
            <article key={c.id} className="creator-card">
              <div className="creator-main">
                <img
                  src={c.avatar}
                  alt={c.display}
                  className="creator-avatar"
                />
                <div>
                  <h3>{c.display}</h3>
                  <p className="muted">{c.role}</p>
                  <div className="favorite-brawlers">
                    {c.favoriteBrawlers.map((bId) => (
                      <span key={bId} className="badge badge-tag">
                        {bId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href={c.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                View profile on Brawlify
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <h2>How to use this during drafts</h2>
        <ol className="usage-list">
          <li>Pick the mode and map you're playing.</li>
          <li>Set whether you have first pick or last pick.</li>
          <li>Lock in all six bans as they happen in the lobby.</li>
          <li>Mirror both your picks and enemy picks as the draft goes.</li>
          <li>
            Use the suggestions as a quick guide, and toggle advanced
            explanations if you want to understand why each pick works.
          </li>
        </ol>
      </section>
    </div>
  );
}
