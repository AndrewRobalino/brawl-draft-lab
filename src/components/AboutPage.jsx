import React from "react";

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

        {/* Carter */}
        <div className="creator-row">
          <img
            className="creator-avatar"
            src="/assets/brawlers/draco.webp"
            alt="Carter avatar"
          />
          <div>
            <h3>Carter &quot;GOAT&quot; B.</h3>
            <p className="muted small">Sharpshooter / Lane Specialist</p>
            <p className="muted small">
              Lives in draft lobbies, spams Piper, Belle, Mandy and any other
              long-range menace. Half of the logic behind the recommendations is
              basically &ldquo;what would Carter insta-lock here?&rdquo;.
            </p>
            <p className="muted small">
              Favorite picks: Piper · Belle · Mandy · Byron
            </p>
          </div>
        </div>

        {/* Andrew */}
        <div className="creator-row">
          <img
            className="creator-avatar"
            src="/assets/brawlers/frank.webp"
            alt="Andrew avatar"
          />
          <div>
            <h3>Andrew &quot;Squadipoo&quot; Robalino</h3>
            <p className="muted small">Mid / Tank Specialist</p>
            <p className="muted small">
              Swaps between control mids and beefy frontliners, focuses on
              drafting comps that actually feel playable in real ranked games,
              not just picture-perfect esports lobbies.
            </p>
            <p className="muted small">
              Favorite picks: Max · Fang · Sam · Doug
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
