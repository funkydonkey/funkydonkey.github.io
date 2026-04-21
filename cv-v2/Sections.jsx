// Sections for v2 — minimal, editorial
function AboutStrip({ data }) {
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">01 — About</span>
          <span>Brief</span>
        </div>
        <div className="about-strip">
          <div className="label">Who I am</div>
          <p className="body">
            I build the reporting layer that large finance teams actually rely on — from consolidation scripts
            and ERP migrations to the dashboards a CFO opens on a Monday. <em>Calm systems,
            honest numbers, fast cycles.</em>
          </p>
          <div className="about-strip__figs">
            {data.stats.map((s, i) => (
              <div key={i}>
                <div className="fig__num">{s.num}{s.unit && <span className="unit">{s.unit}</span>}</div>
                <div className="fig__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceV2({ data }) {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="experience" style={{ background: "var(--bg-2)" }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="num">02 — Experience</span>
          <span>Click to expand</span>
        </div>
        <h2 className="sec-title">
          A short list of <em>measurable work.</em>
        </h2>
        <div>
          {data.experience.map((e, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={"exp2" + (isOpen ? " open" : "")}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <div className="exp2__period">{e.period}</div>
                <div>
                  <h3 className="exp2__role">{e.role}</h3>
                  <div className="exp2__co">{e.company}</div>

                  <div className="exp2__expand">
                    <div>
                      <div className="exp2__inner">
                        <div className="exp2__desc">
                          {e.description.map((p, j) => <p key={j}>{p}</p>)}
                        </div>
                        <div className="exp2__metrics">
                          {e.metrics.map((m, j) => (
                            <div key={j}>
                              <div className="exp2__m-num">{m.num}</div>
                              <div className="exp2__m-label">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="exp2__loc">
                  {e.company.includes("Delivery") ? "Berlin, DE" : e.company.includes("Orlov") ? "Remote" : "St. Petersburg"}
                </div>
                <div className="exp2__plus">+</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Capabilities({ data }) {
  return (
    <section id="capabilities">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">03 — Capabilities</span>
          <span>Technical</span>
        </div>
        <h2 className="sec-title">
          Tools and <em>habits.</em>
        </h2>
        <div className="caps">
          {data.skillGroups.map((g, i) => (
            <div className="cap" key={i}>
              <div className="cap__idx">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="cap__title">{g.title}</h3>
              <div className="cap__list">
                {g.skills.map((s, j) => <span key={j}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkV2({ data }) {
  return (
    <section id="work" style={{ background: "var(--bg-2)" }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="num">04 — Selected work</span>
          <span>3 projects</span>
        </div>
        <h2 className="sec-title">
          Three that <em>moved numbers.</em>
        </h2>
        <div className="work">
          {data.projects.map((p, i) => (
            <div className="work__item" key={i}>
              <div className="work__idx">{String(i + 1).padStart(2, "0")} / {String(data.projects.length).padStart(2, "0")}</div>
              <h3 className="work__title">{p.title}</h3>
              <div className="work__desc">{p.desc}</div>
              <div>
                <div className="work__stat">
                  {p.bigNum}{p.bigUnit && <span className="unit">{p.bigUnit}</span>}
                </div>
                <div className="work__stat-label">{p.bigLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="statement">
      <div className="wrap">
        <p className="statement__text">
          "The job isn't closing the books. It's giving <strong>operators a number they can trust</strong> — on the day they need it."
        </p>
        <div className="statement__sig">— A.M. · on what finance work is for</div>
      </div>
    </section>
  );
}

function EducationV2({ data }) {
  return (
    <section id="education">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">05 — Education</span>
          <span>Certifications</span>
        </div>
        <h2 className="sec-title">
          Still <em>learning.</em>
        </h2>
        <div>
          {data.education.map((e, i) => (
            <div key={i} className="edu2">
              <div className="period">{e.period}</div>
              <div>
                <div className="name">{e.name}</div>
                <div className="org">{e.org}</div>
              </div>
              <div></div>
              <div className={"stat" + (e.statusClass === "inprogress" ? "" : " muted")}>{e.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatV2({ data }) {
  const [messages, setMessages] = React.useState([
    { who: "bot", text: "I'm trained on Andrey's CV. Ask me anything — experience, tools, what he's shipped." },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const streamRef = React.useRef(null);

  React.useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages, busy]);

  const buildPrompt = (u, history) => `
You are a warm, concise career assistant for Andrey Molchansky, Senior Finance Controller based in Berlin.
Speak in first person as his assistant (not as Andrey). Approachable, direct, no invention.
If asked anything not on the CV, say you don't have that detail.

CV FACTS:
- Andrey Molchansky — Senior Group Controller at Delivery Hero SE (Nov 2023—present). Previously: Senior Consultant at Orlov.Finance (Mar 2021—Oct 2023), FP&A Analyst at Sevkabel Holding (Feb 2019—Mar 2021).
- Berlin, EU work auth. Email a.molchansky@gmail.com, +49 176 648 121 94.
- Shipped LucaNet→OneStream migration at Delivery Hero: 340 subsidiaries, 24 historical periods reconsolidated (P&L, BS, CF).
- Built Financial ScoreCard — automated trial-balance screening across 11 regions for MEC.
- At Orlov.Finance, took a B2B SaaS to break-even in 13 months by rebuilding unit economics. Cut reporting cycles to 10 days at 3 companies.
- At Sevkabel, secured €50M+ in real estate renovation investment via modeling+pitches. Cut reporting from 1 month to 10 days.
- Skills: management reporting, budgeting & planning, unit economics, audit support, consolidation scripts, dashboards, IFRS, OneStream, LucaNet, various ERPs, agentic AI.
- Education: ACCA in progress 2024—now, OneStream Essentials (2024), CFO-level FM at Eduson Academy (2022).

STYLE: 2–4 short sentences unless asked to expand. Be specific with numbers. No filler.

${history.slice(-6).map(m => (m.who === "me" ? `User: ${m.text}` : `Assistant: ${m.text}`)).join("\n")}
User: ${u}
Assistant:`;

  const send = async (text) => {
    const clean = (text || "").trim();
    if (!clean || busy) return;
    const next = [...messages, { who: "me", text: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const reply = await window.claude.complete(buildPrompt(clean, next));
      setMessages(m => [...m, { who: "bot", text: (reply || "").trim() || "No response — try again." }]);
    } catch {
      setMessages(m => [...m, { who: "bot", text: "Assistant unavailable. Email Andrey directly from the Contact section." }]);
    } finally { setBusy(false); }
  };

  return (
    <section id="chat">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">06 — Chat</span>
          <span>AI · career assistant</span>
        </div>
        <div className="chat2">
          <div className="chat2__side">
            <div className="chat2__label">Career assistant</div>
            <h3 className="chat2__title">Ask anything about my work.</h3>
            <p className="chat2__sub">Trained on Andrey's CV. Keeps answers short. May be wrong on things outside the page — verify with him.</p>
            <div className="chat2__sugs">
              {data.chatSuggestions.map((s, i) => (
                <button key={i} className="chat2__sug" onClick={() => send(s)} disabled={busy}>{s}</button>
              ))}
            </div>
          </div>
          <div className="chat2__main">
            <div className="chat2__stream" ref={streamRef}>
              {messages.map((m, i) => <div key={i} className={"msg2 msg2--" + m.who}>{m.text}</div>)}
              {busy && <div className="msg2 msg2--bot msg2--thinking">thinking…</div>}
            </div>
            <form className="chat2__form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <input
                className="chat2__input"
                placeholder="Type a question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
              />
              <button className="chat2__send" disabled={busy || !input.trim()}>Send →</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactV2({ data }) {
  return (
    <section id="contact" style={{ background: "var(--bg-2)" }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="num">07 — Contact</span>
          <span>End</span>
        </div>
        <div className="contact2">
          <h2 className="contact2__lead">
            Let's<br/><em>talk.</em>
          </h2>
          <div className="contact2__list">
            <div className="contact2__row">
              <div className="contact2__k">Email</div>
              <a className="contact2__v" href={"mailto:" + data.email}>{data.email}</a>
            </div>
            <div className="contact2__row">
              <div className="contact2__k">Phone</div>
              <a className="contact2__v" href={"tel:" + data.phone.replace(/[^+\d]/g, "")}>{data.phone}</a>
            </div>
            <div className="contact2__row">
              <div className="contact2__k">City</div>
              <div className="contact2__v">{data.location}</div>
            </div>
            <div className="contact2__row">
              <div className="contact2__k">Status</div>
              <div className="contact2__v">{data.authorization}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterV2() {
  return (
    <footer className="foot2">
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <span>© 2026 Andrey Molchansky</span>
        <span>Berlin · v2</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  AboutStrip, ExperienceV2, Capabilities, WorkV2, Statement, EducationV2, ChatV2, ContactV2, FooterV2
});
