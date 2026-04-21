// Tweaks for v2 + App shell
function TweaksV2({ tweaks, setTweaks }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setOpen(true);
      if (d.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const apply = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  };

  if (!open) return null;

  return (
    <div className="tweaks open">
      <h4>
        <span>Tweaks</span>
        <button onClick={() => setOpen(false)}>close</button>
      </h4>

      <div className="tr-row">
        <label>Theme</label>
        <div className="swatches">
          <div className={"sw" + (tweaks.theme === "paper" ? " active" : "")} style={{ background: "#f3f1ec", borderColor: "#d6d2c8" }} onClick={() => apply({ theme: "paper" })}></div>
          <div className={"sw" + (tweaks.theme === "dark" ? " active" : "")} style={{ background: "#0a0a09", borderColor: "#26241f" }} onClick={() => apply({ theme: "dark" })}></div>
        </div>
      </div>

      <div className="tr-row">
        <label>Display</label>
        <select value={tweaks.display} onChange={(e) => apply({ display: e.target.value })}>
          <option value="fraunces">Fraunces</option>
          <option value="inter">Inter Tight</option>
        </select>
      </div>

      <div className="tr-row">
        <label>Motion</label>
        <select value={tweaks.motion} onChange={(e) => apply({ motion: e.target.value })}>
          <option value="on">On</option>
          <option value="reduced">Reduced</option>
        </select>
      </div>
    </div>
  );
}

function App2({ initialTweaks }) {
  const data = window.CV_DATA;
  const [tweaks, setTweaks] = React.useState(initialTweaks);

  React.useEffect(() => {
    document.body.classList.toggle("v2-dark", tweaks.theme === "dark");
    const r = document.documentElement.style;
    if (tweaks.display === "inter") {
      r.setProperty("--font-display", `"Inter Tight", ui-sans-serif, system-ui, sans-serif`);
    } else {
      r.setProperty("--font-display", `"Fraunces", ui-serif, Georgia, serif`);
    }
  }, [tweaks]);

  // Reveal on scroll
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Hero entrance animation
  React.useEffect(() => {
    const items = [".hero-v2__chrome", ".hero-v2__eyebrow", ".hero-v2__name", ".hero-v2__meta"];
    items.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 1.1s ease, transform 1.1s cubic-bezier(0.16, 0.7, 0.2, 1)";
      el.style.transitionDelay = (0.12 + i * 0.14) + "s";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = "";
        el.style.transform = "";
      }));
    });
  }, []);

  return (
    <React.Fragment>
      <HeroV2 data={data} />
      <AboutStrip data={data} />
      <ExperienceV2 data={data} />
      <Capabilities data={data} />
      <WorkV2 data={data} />
      <Statement />
      <ChatV2 data={data} />
      <EducationV2 data={data} />
      <ContactV2 data={data} />
      <FooterV2 />
      <TweaksV2 tweaks={tweaks} setTweaks={setTweaks} />
    </React.Fragment>
  );
}

window.App2 = App2;
window.TweaksV2 = TweaksV2;
