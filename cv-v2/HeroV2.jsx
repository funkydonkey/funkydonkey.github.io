// Hero v2 — quiet typography + canvas animation behind
function HeroV2({ data }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current && window.initHeroCanvas) {
      const dispose = window.initHeroCanvas(canvasRef.current);
      return () => { if (dispose) dispose(); };
    }
  }, []);

  return (
    <section className="hero-v2" id="top">
      <canvas ref={canvasRef} className="hero-canvas"></canvas>

      <div className="hero-v2__chrome">
        <span className="brand">A.Molchansky / 2026</span>
        <div>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#chat">Chat</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className="hero-v2__content">
        <div className="hero-v2__eyebrow">
          <span className="dot"></span>
          <span>Senior Finance Controller · Berlin</span>
          <span style={{ color: "var(--ink-4)" }}>/</span>
          <span>Open to conversations</span>
        </div>

        <h1 className="hero-v2__name">
          Andrey<br/>
          <em>Molchansky.</em>
        </h1>

        <div className="hero-v2__meta">
          <p className="hero-v2__tagline">
            Group consolidation, financial systems, and reporting that helps operators decide.
            Currently shipping at Delivery Hero — 340 subsidiaries, eleven regions, one source of truth.
          </p>
          <div className="hero-v2__coords">
            <span>Based / <strong>52.5200° N · 13.4050° E</strong></span>
            <span>Since / <strong>2019 · six years</strong></span>
            <span>Focus / <strong>OneStream · Consolidation · IFRS</strong></span>
          </div>
          <div className="hero-v2__scroll">Scroll</div>
        </div>
      </div>
    </section>
  );
}

window.HeroV2 = HeroV2;
