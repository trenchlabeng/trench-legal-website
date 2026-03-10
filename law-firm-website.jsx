import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

const RouteCtx = createContext({ page: "home", go: () => {} });
const usePage = () => useContext(RouteCtx);

/* ── tiny SVG icons ── */
const I = {
  intake: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>
    </svg>
  ),
  chrono: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  retrieval: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  demand: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  disc: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/>
    </svg>
  ),
  shield: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  chev: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  lock: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  server: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  eye: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

/* ── Color tokens ── */
const C = {
  bg: "#F5F5F5",
  bgAlt: "#EBEBEB",
  bgCard: "#FFFFFF",
  bgWarm: "#D4D4D4",
  text: "#1A1A1A",
  textSec: "#525252",
  textMuted: "#8C8C8C",
  accent: "#2D2D2D",
  accentLight: "#404040",
  accentBg: "rgba(45,45,45,0.06)",
  accentBorder: "rgba(45,45,45,0.18)",
  border: "rgba(0,0,0,0.08)",
  borderSubtle: "rgba(0,0,0,0.06)",
  green: "#2D7A3A",
  greenBg: "rgba(45,122,58,0.08)",
  blue: "#2563EB",
  blueBg: "rgba(37,99,235,0.08)",
  red: "#C53030",
  redBg: "rgba(197,48,48,0.08)",
  purple: "#7C3AED",
  purpleBg: "rgba(124,58,237,0.08)",
};

/* ── product data ── */
const products = [
  {
    id: "medical-chronology", label: "Medical Chronology", icon: I.chrono,
    tagline: "Medical complexity, made simple",
    short: "From raw records to usable facts — in under 24 hours.",
    desc: "Transform dense medical records into clear, structured chronologies delivered fast. Our AI highlights the details that matter most — diagnoses, treatment timelines, procedures, and key providers — enabling your team to build stronger cases and spot narrative gaps that would take weeks to find manually.",
    stats: [{ val: "70%", label: "Less review time" }, { val: "<24h", label: "Turnaround time" }, { val: "1000s", label: "Pages processed" }],
  },
  {
    id: "demand-letters", label: "Demand Letters", icon: I.demand,
    tagline: "Demands in hours, built to win",
    short: "From claim to close, we handle the draft.",
    desc: "Generate fast, accurate, and tailored demand letters ready to send. Our AI pulls directly from medical records and case facts to produce structured, professional documents that highlight injuries, treatments, and damages with precision — every claim cited to source, every argument backed by evidence.",
    stats: [{ val: "80%", label: "Less drafting time" }, { val: "6×", label: "ROI in first quarter" }, { val: "100%", label: "Source-cited" }],
  },
  {
    id: "client-intake", label: "Client Intake", icon: I.intake,
    tagline: "Find your best cases first",
    short: "AI triage that sharpens your intake and drives firm-level performance.",
    desc: "Our AI evaluates potential case value and extracts critical facts from client intakes in real time — so your firm can focus on the highest-impact opportunities from the start. Automatically surface the strongest claims, filter low-quality leads, and make faster, smarter decisions on every new case that comes through your door.",
    stats: [{ val: "90%", label: "Faster intake processing" }, { val: "3×", label: "More qualified leads" }, { val: "100%", label: "Key facts extracted" }],
  },
  {
    id: "medical-retrieval", label: "Medical Retrieval", icon: I.retrieval,
    tagline: "No phone calls. No faxes. No chasing.",
    short: "Fully automated record acquisition from thousands of providers.",
    desc: "Simplify and accelerate medical record retrieval with a single request. Our agentic workflows retrieve records from thousands of providers nationwide, track request status in real time, and deliver complete, organized records directly to your case file. No more administrative bottlenecks slowing your cases down.",
    stats: [{ val: "12 days", label: "Faster turnaround" }, { val: "100%", label: "Automated tracking" }, { val: "5000+", label: "Provider network" }],
  },
  {
    id: "e-discovery", label: "eDiscovery", icon: I.disc,
    tagline: "Find key evidence instantly",
    short: "80% faster document review with AI tagging and extraction.",
    desc: "Our eDiscovery engine streamlines the review of case files, automatically tagging, sorting, and extracting the documents that matter most. Whether you're combing through medical records, communications, or third-party files, our AI pinpoints relevant content instantly so your team focuses only on what's case-critical.",
    stats: [{ val: "80%", label: "Faster review" }, { val: "Auto", label: "Smart tagging" }, { val: "0", label: "Missed documents" }],
  },
];

/* ── Demo Styles ── */
const demoBox = { background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 12, overflow: "hidden", maxWidth: 480, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" };
const demoHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${C.borderSubtle}`, background: C.bgAlt };
const demoResetBtn = { fontSize: 10, padding: "3px 10px", borderRadius: 20, border: `1px solid ${C.borderSubtle}`, background: "transparent", color: C.textMuted, cursor: "pointer", fontFamily: "inherit" };

/* ── Interactive Demos ── */

function IntakeDemo() {
  const [phase, setPhase] = useState(0); // 0=idle, 1=processing, 2-6=phases, 7=done
  const [tab, setTab] = useState("overview");
  const timerRef = useRef(null);

  const startDemo = () => { setPhase(1); setTab("overview"); };
  const reset = () => { setPhase(0); setTab("overview"); if (timerRef.current) clearTimeout(timerRef.current); };

  useEffect(() => {
    if (phase >= 1 && phase < 7) {
      timerRef.current = setTimeout(() => setPhase((p) => p + 1), phase === 1 ? 1200 : 800);
      return () => clearTimeout(timerRef.current);
    }
  }, [phase]);

  const phaseDone = (n) => phase > n;
  const phaseActive = (n) => phase === n;

  const phases = [
    { n: 2, label: "Client & Contact Info" },
    { n: 3, label: "Incident Analysis" },
    { n: 4, label: "Injury & Medical Review" },
    { n: 5, label: "Insurance & Coverage" },
    { n: 6, label: "Risk & Value Scoring" },
  ];

  const extractedData = {
    overview: {
      case: "Martinez v. TransCo Logistics",
      type: "Motor Vehicle — Rear-End Collision",
      filed: "03/15/2024",
      jurisdiction: "Harris County, TX",
    },
    client: [
      { label: "Name", value: "Sofia Martinez", status: "ok" },
      { label: "DOB", value: "08/12/1987", status: "ok" },
      { label: "Phone", value: "(713) 555-0184", status: "ok" },
      { label: "Email", value: "s.martinez@email.com", status: "ok" },
      { label: "SSN", value: "•••-••-4821", status: "ok" },
      { label: "Address", value: "4210 Westheimer Rd, Houston TX", status: "ok" },
    ],
    incident: [
      { label: "Date / Time", value: "03/15/2024 at 5:42 PM", status: "ok" },
      { label: "Location", value: "I-610 & Westheimer Rd, Houston TX", status: "ok" },
      { label: "Weather", value: "Clear, dry conditions", status: "ok" },
      { label: "Police Report", value: "HPD #24-031587 — Filed", status: "ok" },
      { label: "At-Fault Party", value: "TransCo driver ran red light", status: "ok" },
      { label: "Witnesses", value: "2 identified (statements pending)", status: "warn" },
      { label: "Scene Photos", value: "12 photos uploaded", status: "ok" },
    ],
    medical: [
      { label: "ER Visit", value: "City General ER — 03/15/2024", status: "ok" },
      { label: "Primary Dx", value: "C5-C6 disc herniation", status: "ok" },
      { label: "Secondary Dx", value: "Acute cervical strain, contusions", status: "ok" },
      { label: "Imaging", value: "MRI confirmed disc protrusion", status: "ok" },
      { label: "Current Tx", value: "PT 3×/week + pain management", status: "ok" },
      { label: "Pre-Existing", value: "None reported", status: "ok" },
      { label: "Surgical Consult", value: "Pending — referred by ortho", status: "warn" },
    ],
    insurance: [
      { label: "Client Auto", value: "State Farm — Policy #SF-8841920", status: "ok" },
      { label: "BI Limits", value: "$100K / $300K", status: "ok" },
      { label: "UM/UIM", value: "$100K / $300K", status: "ok" },
      { label: "PIP", value: "$10,000", status: "ok" },
      { label: "Defendant Ins.", value: "Progressive — Policy #PG-2204817", status: "ok" },
      { label: "Def. BI Limits", value: "$250K / $500K", status: "ok" },
      { label: "Med Pay", value: "Not yet confirmed", status: "warn" },
    ],
  };

  const flags = [
    { type: "strength", text: "Clear liability — police report confirms defendant at fault" },
    { type: "strength", text: "Strong coverage — $250K defendant BI limits available" },
    { type: "strength", text: "Objective injury — MRI-confirmed disc herniation" },
    { type: "warn", text: "Witness statements not yet collected — follow up needed" },
    { type: "warn", text: "Surgical consult pending — may increase case value significantly" },
    { type: "warn", text: "Med Pay coverage not confirmed — verify with adjuster" },
  ];

  const missingDocs = [
    { doc: "Witness statements (2)", priority: "High" },
    { doc: "Surgical consult notes", priority: "Medium" },
    { doc: "Defendant's Med Pay declaration", priority: "Medium" },
    { doc: "Lost wage verification letter", priority: "Low" },
  ];

  const tabStyle = (t) => ({
    fontSize: 10, padding: "4px 10px", borderRadius: 6, border: `1px solid ${tab === t ? C.accent : "transparent"}`,
    background: tab === t ? C.accentBg : "transparent", color: tab === t ? C.accent : C.textMuted,
    cursor: "pointer", fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap",
  });

  const statusDot = (s) => ({
    width: 6, height: 6, borderRadius: "50%", background: s === "ok" ? C.green : s === "warn" ? "#D97706" : C.red, flexShrink: 0, marginTop: 5,
  });

  return (
    <div style={{ ...demoBox, maxWidth: 520 }}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>INTAKE AI ENGINE</span>
        <button onClick={reset} style={demoResetBtn}>Reset</button>
      </div>

      {phase === 0 ? (
        <div style={{ padding: "32px 20px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.accentBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.accent }}>
            {I.intake}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>New Intake Ready</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Martinez v. TransCo Logistics — Motor Vehicle</div>
          <button onClick={startDemo} style={{ padding: "8px 24px", borderRadius: 6, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Run AI Triage
          </button>
        </div>
      ) : (
        <div>
          {/* Processing steps */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.borderSubtle}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {phases.map((p) => (
                <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                  {phaseDone(p.n) ? (
                    <div style={{ color: C.green, flexShrink: 0 }}>{I.check}</div>
                  ) : phaseActive(p.n) ? (
                    <div style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, animation: "pulse 0.8s infinite" }} />
                    </div>
                  ) : (
                    <div style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.bgWarm }} />
                    </div>
                  )}
                  <span style={{ fontSize: 11, color: phaseDone(p.n) ? C.green : phaseActive(p.n) ? C.accent : C.textMuted, fontWeight: phaseDone(p.n) || phaseActive(p.n) ? 600 : 400, transition: "color 0.3s" }}>
                    {p.label}
                    {phaseActive(p.n) && <span style={{ fontWeight: 400 }}> — analyzing...</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results area */}
          {phase >= 7 && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {/* Score banner */}
              <div style={{ padding: "14px 16px", background: C.greenBg, borderBottom: `1px solid rgba(45,122,58,0.15)`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.green }}>✓ Intake triage complete</div>
                  <div style={{ fontSize: 10, color: C.textSec, marginTop: 2 }}>26 data points extracted · 3 follow-ups flagged</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.green, fontFamily: "var(--serif)" }}>94</div>
                  <div style={{ fontSize: 9, color: C.green, fontWeight: 600 }}>CASE SCORE</div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ padding: "8px 12px", display: "flex", gap: 4, borderBottom: `1px solid ${C.borderSubtle}`, overflowX: "auto" }}>
                {[
                  { id: "overview", label: "Overview" },
                  { id: "client", label: "Client" },
                  { id: "incident", label: "Incident" },
                  { id: "medical", label: "Medical" },
                  { id: "insurance", label: "Insurance" },
                  { id: "flags", label: "Flags" },
                ].map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(t.id)}>{t.label}</button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ padding: "12px 16px", maxHeight: 220, overflowY: "auto" }}>
                {tab === "overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ padding: "10px 12px", background: C.bgAlt, borderRadius: 8, border: `1px solid ${C.borderSubtle}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{extractedData.overview.case}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{extractedData.overview.type}</div>
                      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                        <span style={{ fontSize: 10, color: C.textSec }}>Filed: {extractedData.overview.filed}</span>
                        <span style={{ fontSize: 10, color: C.textSec }}>{extractedData.overview.jurisdiction}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, padding: "10px 12px", background: C.greenBg, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: C.green }}>High</div>
                        <div style={{ fontSize: 9, color: C.green }}>Case Priority</div>
                      </div>
                      <div style={{ flex: 1, padding: "10px 12px", background: C.accentBg, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>$250K</div>
                        <div style={{ fontSize: 9, color: C.accent }}>Available Coverage</div>
                      </div>
                      <div style={{ flex: 1, padding: "10px 12px", background: "rgba(217,119,6,0.08)", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#D97706" }}>3</div>
                        <div style={{ fontSize: 9, color: "#D97706" }}>Action Items</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginTop: 4 }}>AI Recommendation: Accept — Strong liability, objective injury, high coverage</div>
                  </div>
                )}

                {(tab === "client" || tab === "incident" || tab === "medical" || tab === "insurance") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {(extractedData[tab] || []).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 8px", borderRadius: 6, background: i % 2 === 0 ? C.bgAlt : "transparent" }}>
                        <div style={statusDot(item.status)} />
                        <div style={{ minWidth: 90 }}>
                          <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: 11, color: C.text, fontWeight: 500 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "flags" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: 0.5, marginBottom: 2 }}>CASE STRENGTHS & RISKS</div>
                    {flags.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 10px", borderRadius: 6, background: f.type === "strength" ? C.greenBg : "rgba(217,119,6,0.06)", border: `1px solid ${f.type === "strength" ? "rgba(45,122,58,0.12)" : "rgba(217,119,6,0.12)"}` }}>
                        <span style={{ fontSize: 11, marginTop: 1 }}>{f.type === "strength" ? "✓" : "⚠"}</span>
                        <span style={{ fontSize: 11, color: f.type === "strength" ? C.green : "#B45309", lineHeight: 1.4 }}>{f.text}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: 0.5, marginTop: 8, marginBottom: 2 }}>MISSING DOCUMENTS</div>
                    {missingDocs.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: C.bgAlt, borderRadius: 6 }}>
                        <span style={{ fontSize: 11, color: C.text }}>{d.doc}</span>
                        <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: d.priority === "High" ? C.redBg : d.priority === "Medium" ? "rgba(217,119,6,0.08)" : C.accentBg, color: d.priority === "High" ? C.red : d.priority === "Medium" ? "#B45309" : C.textMuted, fontWeight: 600 }}>{d.priority}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChronoDemo() {
  const [active, setActive] = useState(null);
  const events = [
    { date: "03/15/24", provider: "City General ER", event: "Initial presentation — C5-C6 disc herniation diagnosed", tag: "Diagnosis" },
    { date: "04/02/24", provider: "Dr. Sarah Kim, Ortho", event: "MRI confirms central disc protrusion with nerve root impingement", tag: "Imaging" },
    { date: "05/10/24", provider: "PT Associates", event: "Physical therapy initiated — 3× weekly for 8 weeks", tag: "Treatment" },
    { date: "07/22/24", provider: "Dr. Kim, Ortho", event: "Epidural steroid injection administered at C5-C6 level", tag: "Procedure" },
    { date: "09/18/24", provider: "Dr. Kim, Ortho", event: "Patient reached MMI — permanent impairment rating: 12%", tag: "MMI" },
  ];
  const colors = { Diagnosis: C.red, Imaging: C.blue, Treatment: C.accent, Procedure: C.purple, MMI: C.green };
  const bgs = { Diagnosis: C.redBg, Imaging: C.blueBg, Treatment: C.accentBg, Procedure: C.purpleBg, MMI: C.greenBg };
  return (
    <div style={demoBox}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>MEDICAL CHRONOLOGY</span>
        <span style={{ fontSize: 10, color: C.textMuted }}>5 events · 2,340 pages</span>
      </div>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 0 }}>
        {events.map((e, i) => (
          <div key={i} onClick={() => setActive(active === i ? null : i)} style={{ display: "flex", gap: 12, cursor: "pointer", padding: "10px 4px", borderLeft: `2px solid ${active === i ? colors[e.tag] : C.bgWarm}`, marginLeft: 8, paddingLeft: 16, transition: "all 0.3s ease", background: active === i ? C.accentBg : "transparent", borderRadius: "0 6px 6px 0" }}>
            <div style={{ fontSize: 11, color: C.textMuted, minWidth: 62, fontFamily: "monospace" }}>{e.date}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{e.event}</div>
              {active === i && <div style={{ fontSize: 11, color: C.textSec, marginTop: 4 }}>Provider: {e.provider} · Page ref: {(i + 1) * 187}</div>}
            </div>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: bgs[e.tag], color: colors[e.tag], fontWeight: 600, height: "fit-content", whiteSpace: "nowrap" }}>{e.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetrievalDemo() {
  const reqs = [
    { provider: "City General Hospital", status: "delivered", days: 0 },
    { provider: "Advanced Imaging Center", status: "delivered", days: 0 },
    { provider: "PT Associates", status: "in-transit", days: 2 },
    { provider: "Dr. Kim Orthopedics", status: "requested", days: 5 },
  ];
  const ss = { delivered: { bg: C.greenBg, c: C.green, t: "Delivered" }, "in-transit": { bg: C.blueBg, c: C.blue, t: "In Transit" }, requested: { bg: C.accentBg, c: C.accent, t: "Requested" } };
  return (
    <div style={demoBox}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>RECORD RETRIEVAL</span>
        <span style={{ fontSize: 10, color: C.green }}>● 2 of 4 complete</span>
      </div>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {reqs.map((r, i) => {
          const s = ss[r.status];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: C.bgAlt, borderRadius: 8, border: `1px solid ${C.borderSubtle}` }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{r.provider}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{r.status === "delivered" ? "Complete" : `Est. ${r.days} days remaining`}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.c, fontWeight: 600 }}>{s.t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DemandDemo() {
  const [sec, setSec] = useState(0);
  const sections = ["Liability Analysis", "Medical Summary", "Special Damages", "Pain & Suffering", "Settlement Demand"];
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (sec < sections.length) {
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setSec((s) => s + 1); }, 1200);
      return () => clearTimeout(t);
    }
  }, [sec]);
  const reset = () => { setSec(0); };
  return (
    <div style={demoBox}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>DEMAND LETTER GENERATOR</span>
        <button onClick={reset} style={demoResetBtn}>Reset</button>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>Martinez v. TransCo — Auto Accident</div>
        {sections.slice(0, sec).map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.borderSubtle}` }}>
            <div style={{ color: C.green }}>{I.check}</div>
            <span style={{ fontSize: 12, color: C.text }}>{s}</span>
            <span style={{ fontSize: 10, color: C.textMuted, marginLeft: "auto" }}>Generated</span>
          </div>
        ))}
        {typing && sec < sections.length && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, animation: "pulse 0.8s infinite" }} />
            <span style={{ fontSize: 12, color: C.accent }}>Drafting {sections[sec]}...</span>
          </div>
        )}
        {sec >= sections.length && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: C.greenBg, border: `1px solid rgba(45,122,58,0.15)`, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>✓ Demand letter complete</div>
            <div style={{ fontSize: 11, color: C.textSec, marginTop: 4 }}>5 sections · 14 pages · 47 citations to source</div>
          </div>
        )}
      </div>
    </div>
  );
}

function DiscoveryDemo() {
  const [filter, setFilter] = useState("all");
  const docs = [
    { name: "ER_Admission_Notes.pdf", tag: "Medical", relevance: 96 },
    { name: "Police_Report_2024.pdf", tag: "Liability", relevance: 91 },
    { name: "Insurance_Correspondence.pdf", tag: "Financial", relevance: 78 },
    { name: "Witness_Statement_Jones.pdf", tag: "Testimony", relevance: 85 },
    { name: "Employment_Records.pdf", tag: "Financial", relevance: 62 },
  ];
  const tagC = { Medical: C.blue, Liability: C.red, Financial: C.accent, Testimony: C.purple };
  const tagBg = { Medical: C.blueBg, Liability: C.redBg, Financial: C.accentBg, Testimony: C.purpleBg };
  const filtered = filter === "all" ? docs : docs.filter((d) => d.tag === filter);
  return (
    <div style={demoBox}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>eDISCOVERY ENGINE</span>
        <span style={{ fontSize: 10, color: C.textMuted }}>49 docs analyzed</span>
      </div>
      <div style={{ padding: "8px 16px 4px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["all", "Medical", "Liability", "Financial", "Testimony"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, border: `1px solid ${filter === f ? C.accent : C.borderSubtle}`, background: filter === f ? C.accentBg : "transparent", color: filter === f ? C.accent : C.textMuted, cursor: "pointer", fontWeight: 600, textTransform: "capitalize", fontFamily: "inherit" }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: "8px 16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.bgAlt, borderRadius: 6, border: `1px solid ${C.borderSubtle}` }}>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: tagBg[d.tag], color: tagC[d.tag], fontWeight: 700, whiteSpace: "nowrap" }}>{d.tag}</span>
            <span style={{ flex: 1, fontSize: 11, color: C.text, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
            <span style={{ fontSize: 10, color: d.relevance > 80 ? C.green : C.accent, fontWeight: 700 }}>{d.relevance}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChronoSearchDemo() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const events = [
    { id: 0, date: "03/15/24", title: "Emergency Room Admission", category: "Diagnosis", provider: "City General Hospital", detail: "Patient presented with acute neck pain and bilateral arm numbness following MVC. C-collar applied. X-ray and CT ordered. Diagnosed with C5-C6 disc herniation, acute cervical strain, and multiple contusions. Discharged with pain management protocol.", pages: "p. 1–8", icd: "M50.120, S13.4XXA", cpt: "99284, 72052" },
    { id: 1, date: "03/22/24", title: "Orthopedic Consultation", category: "Consultation", provider: "Dr. Sarah Kim, Orthopedics", detail: "Initial orthopedic evaluation. Reviewed ER records and imaging. Noted limited cervical ROM and positive Spurling's test on the right. Ordered MRI of cervical spine. Recommended physical therapy 3×/week and prescribed Meloxicam 15mg.", pages: "p. 12–15", icd: "M50.120", cpt: "99243" },
    { id: 2, date: "04/02/24", title: "MRI — Cervical Spine", category: "Imaging", provider: "Advanced Imaging Center", detail: "MRI confirms central disc protrusion at C5-C6 with moderate right foraminal stenosis and nerve root impingement. No spinal cord compression. Mild disc desiccation at C4-C5. Findings consistent with traumatic disc injury.", pages: "p. 22–24", icd: "M50.120", cpt: "72141" },
    { id: 3, date: "04/08/24", title: "Physical Therapy — Initial Eval", category: "Treatment", provider: "PT Associates — J. Williams, DPT", detail: "Baseline evaluation: cervical flexion 30° (norm 50°), extension 20° (norm 60°). Pain 7/10 at rest. Treatment plan: manual therapy, cervical traction, therapeutic exercise. Goals: restore ROM, reduce pain to 3/10, return to work within 8 weeks.", pages: "p. 28–31", icd: "M50.120, M54.12", cpt: "97161" },
    { id: 4, date: "04/08–06/28", title: "Physical Therapy — 24 Sessions", category: "Treatment", provider: "PT Associates — J. Williams, DPT", detail: "Progressive rehabilitation over 24 sessions. Cervical flexion improved to 42° by session 12. Pain reduced to 4/10. Cervical traction and manual therapy provided relief but plateau noted after session 18. Patient reported persistent right arm radiculopathy.", pages: "p. 32–78", icd: "M50.120, M54.12", cpt: "97140, 97110, 97012" },
    { id: 5, date: "05/15/24", title: "Pain Management Consultation", category: "Consultation", provider: "Dr. R. Patel, Pain Management", detail: "Evaluated for interventional pain management. EMG/NCS ordered to assess radiculopathy. Discussed epidural steroid injection options. Patient prefers to continue conservative treatment before proceeding with injection.", pages: "p. 80–83", icd: "M54.12, G54.1", cpt: "99244" },
    { id: 6, date: "06/03/24", title: "EMG / Nerve Conduction Study", category: "Diagnostic", provider: "NeuroSpine Diagnostics", detail: "EMG/NCS reveals moderate right C6 radiculopathy consistent with MRI findings. No evidence of peripheral neuropathy. Fibrillation potentials noted in right biceps and brachioradialis. Findings support surgical consultation.", pages: "p. 86–90", icd: "G54.1", cpt: "95907, 95913" },
    { id: 7, date: "07/22/24", title: "Epidural Steroid Injection", category: "Procedure", provider: "Dr. R. Patel, Pain Management", detail: "C5-C6 right transforaminal ESI performed under fluoroscopic guidance. 80mg Depo-Medrol + 1mL Bupivacaine 0.25% injected. Patient tolerated procedure well. 50% pain relief at 2-week follow-up. Second injection recommended in 4–6 weeks.", pages: "p. 92–95", icd: "M50.120, G54.1", cpt: "64483" },
    { id: 8, date: "08/19/24", title: "Second ESI + Follow-Up", category: "Procedure", provider: "Dr. R. Patel, Pain Management", detail: "Second transforaminal ESI at C5-C6. Patient reports only 30% sustained relief from first injection. Pain returned to 5/10 at rest with persistent radiculopathy. Dr. Patel recommends surgical consultation given incomplete response to conservative care.", pages: "p. 98–102", icd: "M50.120", cpt: "64483" },
    { id: 9, date: "09/05/24", title: "Surgical Consultation", category: "Consultation", provider: "Dr. M. Torres, Neurosurgery", detail: "Reviewed full treatment history, MRI, and EMG. Recommends anterior cervical discectomy and fusion (ACDF) at C5-C6. Discussed risks, alternatives, and expected 12-week recovery. Patient consents to surgery pending scheduling and pre-op clearance.", pages: "p. 105–112", icd: "M50.120", cpt: "99245" },
    { id: 10, date: "09/18/24", title: "Maximum Medical Improvement", category: "MMI", provider: "Dr. Sarah Kim, Orthopedics", detail: "Patient assessed pre-surgery. Current cervical ROM: flexion 38°, extension 28°. Permanent impairment rating: 12% whole person per AMA Guides 6th Ed. Future medical needs: ACDF surgery ($85,000 est.), post-op PT (12 weeks), annual follow-up for 5 years.", pages: "p. 115–120", icd: "M50.120", cpt: "99215" },
    { id: 11, date: "03/15–09/18", title: "Medication History", category: "Medication", provider: "Multiple providers", detail: "Meloxicam 15mg daily (ongoing since 03/22). Cyclobenzaprine 10mg TID (03/15–05/01, discontinued). Gabapentin 300mg TID (started 06/10, ongoing). Tramadol 50mg PRN (prescribed 07/22, limited use). No opioid dependence noted.", pages: "p. 122–125", icd: "M54.12", cpt: "—" },
  ];

  const categories = ["all", "Diagnosis", "Imaging", "Treatment", "Procedure", "Consultation", "Diagnostic", "Medication", "MMI"];
  const catColors = {
    Diagnosis: C.red, Imaging: C.blue, Treatment: "#D97706", Procedure: C.purple,
    Consultation: C.accent, Diagnostic: C.blue, Medication: "#0E7490", MMI: C.green,
  };
  const catBgs = {
    Diagnosis: C.redBg, Imaging: C.blueBg, Treatment: "rgba(217,119,6,0.08)", Procedure: C.purpleBg,
    Consultation: C.accentBg, Diagnostic: C.blueBg, Medication: "rgba(14,116,144,0.08)", MMI: C.greenBg,
  };

  const filtered = events.filter((e) => {
    const matchCat = activeFilter === "all" || e.category === activeFilter;
    const q = query.toLowerCase();
    const matchQuery = !q || e.title.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.provider.toLowerCase().includes(q) || e.icd.toLowerCase().includes(q) || e.cpt.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div style={{ ...demoBox, maxWidth: 580 }}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>CASE TIMELINE SEARCH</span>
        <span style={{ fontSize: 10, color: C.textMuted }}>{events.length} events · 125 pages</span>
      </div>

      {/* Search bar */}
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.borderSubtle}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.bgAlt, borderRadius: 8, border: `1px solid ${C.borderSubtle}` }}>
          <svg width="14" height="14" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, providers, ICD codes, procedures..."
            style={{ flex: 1, border: "none", background: "transparent", color: C.text, fontSize: 12, fontFamily: "inherit", outline: "none" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div style={{ padding: "8px 14px", display: "flex", gap: 4, flexWrap: "wrap", borderBottom: `1px solid ${C.borderSubtle}` }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveFilter(cat)} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, border: `1px solid ${activeFilter === cat ? (catColors[cat] || C.accent) : "transparent"}`, background: activeFilter === cat ? (catBgs[cat] || C.accentBg) : "transparent", color: activeFilter === cat ? (catColors[cat] || C.accent) : C.textMuted, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", textTransform: "capitalize" }}>{cat}</button>
        ))}
      </div>

      {/* Results */}
      <div style={{ maxHeight: 320, overflowY: "auto", padding: "8px 10px" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "24px 16px", textAlign: "center", color: C.textMuted, fontSize: 12 }}>No events match your search.</div>
        )}
        {filtered.map((e) => {
          const isOpen = expanded === e.id;
          const color = catColors[e.category] || C.accent;
          const bg = catBgs[e.category] || C.accentBg;
          return (
            <div key={e.id} onClick={() => setExpanded(isOpen ? null : e.id)} style={{ marginBottom: 6, borderRadius: 8, border: `1px solid ${isOpen ? color + "30" : C.borderSubtle}`, background: isOpen ? bg : "transparent", cursor: "pointer", transition: "all 0.2s", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace", minWidth: 62 }}>{e.date}</span>
                <span style={{ flex: 1, fontSize: 12, color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: bg, color: color, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{e.category}</span>
                <svg width="12" height="12" fill="none" stroke={C.textMuted} strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {isOpen && (
                <div style={{ padding: "0 12px 12px 28px", animation: "fadeIn 0.3s ease" }}>
                  <div style={{ fontSize: 11, color: C.textSec, marginBottom: 6, fontWeight: 500 }}>{e.provider}</div>
                  <p style={{ fontSize: 11, color: C.textSec, lineHeight: 1.6, margin: "0 0 10px" }}>{e.detail}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, color: C.textMuted }}>ICD: {e.icd}</span>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, color: C.textMuted }}>CPT: {e.cpt}</span>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, color: C.textMuted }}>Ref: {e.pages}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${C.borderSubtle}`, background: C.bgAlt, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: C.textMuted }}>Showing {filtered.length} of {events.length} events</span>
        <span style={{ fontSize: 10, color: C.accent, fontWeight: 500 }}>Martinez v. TransCo</span>
      </div>
    </div>
  );
}

function DemandEditorDemo() {
  const [activeSection, setActiveSection] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editIdx, setEditIdx] = useState(null);

  const sections = [
    {
      title: "Liability Analysis",
      paragraphs: [
        { id: 0, text: "On March 15, 2024, at approximately 5:42 PM, the Defendant's driver operated a commercial vehicle through the intersection of I-610 and Westheimer Road, Houston, Texas, in direct violation of a red traffic signal.", editable: true },
        { id: 1, text: "The Defendant's negligence was the sole proximate cause of the collision, as confirmed by Houston Police Department Report #24-031587 and statements from two independent witnesses at the scene.", editable: true },
      ],
    },
    {
      title: "Medical Summary",
      paragraphs: [
        { id: 2, text: "Ms. Martinez was transported to City General Emergency Room where she was diagnosed with a C5-C6 disc herniation, acute cervical strain, and multiple contusions.", editable: true },
        { id: 3, text: "Subsequent MRI imaging on April 2, 2024 confirmed a central disc protrusion with nerve root impingement at C5-C6, necessitating ongoing physical therapy three times weekly and referral for epidural steroid injection.", editable: true },
      ],
    },
    {
      title: "Special Damages",
      paragraphs: [
        { id: 4, text: "Emergency room treatment and diagnostic imaging: $14,850.00. Orthopedic consultation and follow-up visits: $3,200.00. Physical therapy (24 sessions): $7,680.00. Epidural steroid injection: $4,500.00.", editable: true },
        { id: 5, text: "Lost wages from March 15 through May 28, 2024 (74 days): $18,500.00. Total special damages to date: $48,730.00.", editable: true },
      ],
    },
    {
      title: "Pain & Suffering",
      paragraphs: [
        { id: 6, text: "The claimant has endured significant physical pain, emotional distress, and diminished quality of life as a direct result of the Defendant's negligence. Daily activities including work, exercise, and sleep have been materially impaired.", editable: true },
      ],
    },
    {
      title: "Settlement Demand",
      paragraphs: [
        { id: 7, text: "Based on the foregoing, we hereby demand the sum of $195,000.00 in full settlement of all claims arising from this incident, inclusive of all special and general damages, past and future.", editable: true },
      ],
    },
  ];

  const [edits, setEdits] = useState({});
  const getText = (p) => edits[p.id] !== undefined ? edits[p.id] : p.text;
  const handleEdit = (id, val) => setEdits({ ...edits, [id]: val });

  const sidebarStyle = (i) => ({
    padding: "8px 12px", fontSize: 12, fontWeight: activeSection === i ? 600 : 400,
    color: activeSection === i ? C.accent : C.textMuted, background: activeSection === i ? C.accentBg : "transparent",
    border: "none", borderLeft: `2px solid ${activeSection === i ? C.accent : "transparent"}`,
    cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%", transition: "all 0.2s",
  });

  const editCount = Object.keys(edits).length;

  return (
    <div style={{ ...demoBox, maxWidth: 620 }}>
      <div style={demoHeader}>
        <span style={{ color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>DEMAND LETTER EDITOR</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {editCount > 0 && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: C.greenBg, color: C.green, fontWeight: 600 }}>{editCount} edit{editCount > 1 ? "s" : ""}</span>
          )}
          <button onClick={() => { setEdits({}); setEditing(false); setEditIdx(null); }} style={demoResetBtn}>Reset</button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "6px 12px", borderBottom: `1px solid ${C.borderSubtle}`, display: "flex", alignItems: "center", gap: 4, background: C.bgAlt }}>
        {[
          { label: "B", style: "bold" },
          { label: "I", style: "italic" },
          { label: "U", style: "underline" },
        ].map((btn) => (
          <button key={btn.style} style={{ width: 26, height: 26, borderRadius: 4, border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.textSec, fontSize: 11, fontWeight: btn.style === "bold" ? 700 : 400, fontStyle: btn.style === "italic" ? "italic" : "normal", textDecoration: btn.style === "underline" ? "underline" : "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>{btn.label}</button>
        ))}
        <div style={{ width: 1, height: 18, background: C.borderSubtle, margin: "0 4px" }} />
        <button style={{ height: 26, padding: "0 8px", borderRadius: 4, border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.textSec, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>¶ Style</button>
        <button style={{ height: 26, padding: "0 8px", borderRadius: 4, border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.textSec, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>+ Citation</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button style={{ height: 26, padding: "0 10px", borderRadius: 4, border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.textSec, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>↩ Undo</button>
          <button style={{ height: 26, padding: "0 10px", borderRadius: 4, border: "none", background: C.accent, color: "#FFFFFF", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 }}>Export PDF</button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 300 }}>
        {/* Sidebar */}
        <div style={{ width: 140, borderRight: `1px solid ${C.borderSubtle}`, padding: "8px 0", flexShrink: 0 }}>
          <div style={{ padding: "4px 12px 8px", fontSize: 9, color: C.textMuted, fontWeight: 600, letterSpacing: 0.5 }}>SECTIONS</div>
          {sections.map((s, i) => (
            <button key={i} onClick={() => { setActiveSection(i); setEditing(false); setEditIdx(null); }} style={sidebarStyle(i)}>{s.title}</button>
          ))}
          <div style={{ margin: "8px 12px", padding: "8px", background: C.accentBg, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: C.accent, fontWeight: 600 }}>AI GENERATED</div>
            <div style={{ fontSize: 10, color: C.textSec, marginTop: 2 }}>5 sections · 47 citations</div>
          </div>
        </div>

        {/* Editor area */}
        <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", maxHeight: 300 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4, fontFamily: "var(--serif)" }}>{sections[activeSection].title}</div>
          <div style={{ width: 30, height: 2, background: C.accent, borderRadius: 1, marginBottom: 14 }} />

          {sections[activeSection].paragraphs.map((p) => {
            const isEditing = editing && editIdx === p.id;
            const wasEdited = edits[p.id] !== undefined;
            return (
              <div key={p.id} style={{ position: "relative", marginBottom: 12, borderRadius: 6, border: `1px solid ${isEditing ? C.accent : wasEdited ? C.green + "40" : "transparent"}`, background: isEditing ? C.accentBg : wasEdited ? C.greenBg : "transparent", transition: "all 0.2s" }}>
                {isEditing ? (
                  <div>
                    <textarea
                      value={getText(p)}
                      onChange={(e) => handleEdit(p.id, e.target.value)}
                      style={{ width: "100%", minHeight: 80, padding: "10px 12px", border: "none", background: "transparent", color: C.text, fontSize: 12, fontFamily: "var(--serif)", lineHeight: 1.7, outline: "none", resize: "vertical" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "4px 8px 8px" }}>
                      <button onClick={() => { setEditing(false); setEditIdx(null); }} style={{ fontSize: 10, padding: "4px 12px", borderRadius: 4, border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.textSec, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                      <button onClick={() => { setEditing(false); setEditIdx(null); }} style={{ fontSize: 10, padding: "4px 12px", borderRadius: 4, border: "none", background: C.accent, color: "#FFFFFF", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setEditing(true); setEditIdx(p.id); }} style={{ padding: "8px 12px", cursor: "pointer", position: "relative" }}>
                    <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, fontFamily: "var(--serif)", margin: 0 }}>{getText(p)}</p>
                    {wasEdited && (
                      <span style={{ position: "absolute", top: 4, right: 4, fontSize: 8, padding: "1px 6px", borderRadius: 10, background: C.greenBg, color: C.green, fontWeight: 600 }}>Edited</span>
                    )}
                    <div style={{ position: "absolute", top: 4, right: wasEdited ? 50 : 4, opacity: 0, transition: "opacity 0.15s" }} className="editHint">
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: C.accentBg, color: C.accent, fontWeight: 500 }}>Click to edit</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Citation footnotes */}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.borderSubtle}` }}>
            {activeSection === 0 && (
              <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>Sources:</span> HPD Report #24-031587 (p.1-3) · Witness Statement — J. Rodriguez (p.12) · Witness Statement — A. Kim (p.14)
              </div>
            )}
            {activeSection === 1 && (
              <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>Sources:</span> City General ER Records (p.1-8) · MRI Report — Advanced Imaging (p.22-24) · Dr. Kim Ortho Notes (p.30-35)
              </div>
            )}
            {activeSection === 2 && (
              <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>Sources:</span> Medical billing records (p.40-52) · Employment verification — Martinez Employer (p.55) · Pay stubs (p.56-58)
              </div>
            )}
            {activeSection >= 3 && (
              <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>Sources:</span> All cited medical and incident documentation · Case valuation analysis
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.borderSubtle}`, background: C.bgAlt, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: C.textMuted }}>Martinez v. TransCo · 14 pages · Last saved 2m ago</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
          <span style={{ fontSize: 10, color: C.green, fontWeight: 500 }}>All changes saved</span>
        </div>
      </div>
    </div>
  );
}

const demoComponents = {
  "client-intake": IntakeDemo,
  "medical-chronology": ChronoDemo,
  "medical-retrieval": RetrievalDemo,
  "demand-letters": DemandDemo,
  "e-discovery": DiscoveryDemo,
};

/* ══════ NAV ══════ */
function Nav() {
  const { go } = usePage();
  const [prodOpen, setProdOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prodRef = useRef(null);
  const resRef = useRef(null);
  const compRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e) => {
      if (prodRef.current && !prodRef.current.contains(e.target)) setProdOpen(false);
      if (resRef.current && !resRef.current.contains(e.target)) setResOpen(false);
      if (compRef.current && !compRef.current.contains(e.target)) setCompOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const navLink = { fontSize: 17, color: C.textSec, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, padding: "8px 0", transition: "color 0.2s" };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 76, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", background: scrolled ? "rgba(245,245,245,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent", transition: "all 0.3s ease" }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, justifySelf: "start" }}>
        <div style={{ width: 55, height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            {/* Shield outline */}
            <path d="M16 1.5 L3.5 6.5 L3.5 16 Q3.5 25.5 16 30.5 Q28.5 25.5 28.5 16 L28.5 6.5 Z" fill="none" stroke="#2D2D2D" strokeWidth="1.5"/>
            {/* Circuit traces */}
            <line x1="6" y1="10" x2="10" y2="10" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.3"/>
            <line x1="22" y1="10" x2="26" y2="10" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.3"/>
            <line x1="6" y1="18" x2="8.5" y2="18" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
            <line x1="23.5" y1="18" x2="26" y2="18" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
            <line x1="6" y1="10" x2="6" y2="14" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
            <line x1="26" y1="10" x2="26" y2="14" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
            {/* Circuit nodes */}
            <circle cx="6" cy="10" r="1.2" fill="#2D2D2D" opacity="0.35"/>
            <circle cx="26" cy="10" r="1.2" fill="#2D2D2D" opacity="0.35"/>
            <circle cx="6" cy="14" r="0.9" fill="#2D2D2D" opacity="0.25"/>
            <circle cx="26" cy="14" r="0.9" fill="#2D2D2D" opacity="0.25"/>
            <circle cx="6" cy="18" r="0.9" fill="#2D2D2D" opacity="0.25"/>
            <circle cx="26" cy="18" r="0.9" fill="#2D2D2D" opacity="0.25"/>
            {/* Scales logo inside — scaled to fit */}
            <rect x="14" y="9" width="4" height="14" rx="1" fill="#2D2D2D"/>
            <rect x="7" y="7.5" width="18" height="3" rx="1.2" fill="#2D2D2D"/>
            <path d="M9 12.5 L7 17 Q6.5 18 7.8 18 L10.2 18 Q11.5 18 11 17 Z" fill="#2D2D2D" opacity="0.85"/>
            <path d="M23 12.5 L21 17 Q20.5 18 21.8 18 L24.2 18 Q25.5 18 25 17 Z" fill="#2D2D2D" opacity="0.85"/>
            <line x1="9" y1="10.5" x2="9" y2="12.5" stroke="#2D2D2D" strokeWidth="0.8" opacity="0.7"/>
            <line x1="23" y1="10.5" x2="23" y2="12.5" stroke="#2D2D2D" strokeWidth="0.8" opacity="0.7"/>
            <rect x="11" y="22.5" width="10" height="2" rx="1" fill="#2D2D2D" opacity="0.5"/>
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 600, color: C.text, letterSpacing: 1.25 }}>TRENCH</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: 5, textTransform: "uppercase", marginTop: -1 }}>{" "}Legal</span>
        </div>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 35 }}>
        <div ref={prodRef} style={{ position: "relative" }}>
          <button onClick={() => { setProdOpen(!prodOpen); setResOpen(false); setCompOpen(false); }} style={{ ...navLink, color: prodOpen ? C.accent : C.textSec }}>Product {I.chev}</button>
          {prodOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: -20, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 8, minWidth: 280, animation: "slideDown 0.2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
              {products.map((p) => (
                <button key={p.id} onClick={() => { go(p.id); setProdOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: C.text, fontFamily: "inherit", fontSize: 13, textAlign: "left", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.accentBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                  <span style={{ color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, flexShrink: 0 }}>{p.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 500 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{p.short}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={resRef} style={{ position: "relative" }}>
          <button onClick={() => { setResOpen(!resOpen); setProdOpen(false); setCompOpen(false); }} style={{ ...navLink, color: resOpen ? C.accent : C.textSec }}>Resources {I.chev}</button>
          {resOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: -20, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 8, minWidth: 240, animation: "slideDown 0.2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
              <button onClick={() => { go("blog"); setResOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: C.text, fontFamily: "inherit", fontSize: 13, textAlign: "left", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.accentBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                <span style={{ color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 500 }}>Blog</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Insights & news for PI firms</div>
                </div>
              </button>
              <button onClick={() => { go("security"); setResOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: C.text, fontFamily: "inherit", fontSize: 13, textAlign: "left", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.accentBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                <span style={{ color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, flexShrink: 0 }}>{I.shield}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 500 }}>Security</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Privacy, encryption & compliance</div>
                </div>
              </button>
            </div>
          )}
        </div>

        <div ref={compRef} style={{ position: "relative" }}>
          <button onClick={() => { setCompOpen(!compOpen); setProdOpen(false); setResOpen(false); }} style={{ ...navLink, color: compOpen ? C.accent : C.textSec }}>Company {I.chev}</button>
          {compOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: -20, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 8, minWidth: 240, animation: "slideDown 0.2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
              <button onClick={() => { go("about"); setCompOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: C.text, fontFamily: "inherit", fontSize: 13, textAlign: "left", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.accentBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                <span style={{ color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 500 }}>About Us</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Our mission, team & values</div>
                </div>
              </button>
            </div>
          )}
        </div>

        </div>

        <button onClick={() => go("demo")} style={{ padding: "10px 28px", borderRadius: 10, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s, box-shadow 0.15s", boxShadow: "0 2px 12px rgba(45,45,45,0.2)", justifySelf: "end" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,45,45,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(45,45,45,0.2)"; }}>
          Request a Demo
        </button>
    </nav>
  );
}

/* ══════ HOME ══════ */
function HomePage() {
  const { go } = usePage();
  const [activeFeature, setActiveFeature] = useState(0);
  const DemoComp = demoComponents[products[activeFeature].id];

  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.play().catch(() => {});
    }
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 40px 80px", position: "relative", overflow: "hidden" }}>
        {/* Background video */}
        <video
          ref={videoRef}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          src="/Lawyer_in_office.mp4"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
        />
        {/* Overlay for readability */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(245,245,245,0.85) 0%, rgba(245,245,245,0.80) 50%, rgba(245,245,245,0.92) 100%)", zIndex: 1 }} />

        <div style={{ animation: "fadeUp 0.8s ease", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: `1px solid ${C.accentBorder}`, background: "rgba(245,245,245,0.8)", backdropFilter: "blur(8px)", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 500, letterSpacing: 0.5 }}>AI-Powered Case Preparation Platform</span>
          </div>
        </div>

        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 500, lineHeight: 1.1, maxWidth: 800, animation: "fadeUp 0.8s ease 0.1s both", color: C.text, position: "relative", zIndex: 2 }}>
          Move more cases to<br />settlement <span style={{ color: C.accent, fontStyle: "italic" }}>faster</span>
        </h1>

        <p style={{ fontSize: 18, color: C.textSec, maxWidth: 580, marginTop: 24, lineHeight: 1.6, animation: "fadeUp 0.8s ease 0.2s both", position: "relative", zIndex: 2 }}>
          TrenchLegal is the AI case preparation platform that helps personal injury firms take on more clients, reduce human errors, and win more of the right cases.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 40, animation: "fadeUp 0.8s ease 0.3s both", position: "relative", zIndex: 2 }}>
          <button onClick={() => go("demo")} style={{ padding: "14px 32px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(45,45,45,0.2)", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,45,45,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(45,45,45,0.2)"; }}>
            Request a Demo
          </button>
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 32px", borderRadius: 8, background: "rgba(245,245,245,0.7)", backdropFilter: "blur(8px)", border: `1px solid ${C.accentBorder}`, color: C.accent, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,245,245,0.9)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(245,245,245,0.7)")}>
            See Features
          </button>
        </div>

        <div style={{ display: "flex", gap: 48, marginTop: 80, animation: "fadeUp 0.8s ease 0.5s both", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 2 }}>
          {[{ val: "15+", lbl: "Hours saved per case" }, { val: "80%", lbl: "Faster document review" }, { val: "100%", lbl: "Evidence cited to source" }, { val: "50–70%", lbl: "Less review time" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 600, color: C.accent }}>{s.val}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Platform</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 500, color: C.text, marginTop: 12 }}>One platform for your entire case</h2>
          <p style={{ color: C.textSec, fontSize: 16, marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>From intake through settlement, every tool your team needs to prepare cases faster without cutting corners.</p>
        </div>

        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
          {products.map((p, i) => (
            <button key={p.id} onClick={() => setActiveFeature(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: `1px solid ${activeFeature === i ? C.accentBorder : "transparent"}`, background: activeFeature === i ? C.accentBg : "transparent", color: activeFeature === i ? C.accent : C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div key={products[activeFeature].id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", animation: "fadeIn 0.4s ease" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 6, background: C.accentBg, border: `1px solid ${C.accentBorder}`, marginBottom: 16 }}>
              <span style={{ color: C.accent }}>{products[activeFeature].icon}</span>
              <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 0.5 }}>{products[activeFeature].label}</span>
            </div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 500, color: C.text, lineHeight: 1.2, marginBottom: 16 }}>{products[activeFeature].tagline}</h3>
            <p style={{ color: C.textSec, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{products[activeFeature].desc}</p>
            <div style={{ display: "flex", gap: 24 }}>
              {products[activeFeature].stats.map((s, j) => (
                <div key={j}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 600, color: C.accent }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => go(products[activeFeature].id)} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, padding: "10px 20px", borderRadius: 8, background: "transparent", border: `1px solid ${C.accentBorder}`, color: C.accent, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.accentBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              Learn more {I.arrow}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DemoComp />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section style={{ padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, fontStyle: "italic", color: C.text, lineHeight: 1.5, marginBottom: 24 }}>
            "Our case managers used to spend hours on repetitive tasks that are now handled in minutes. We've cut redundancies, nearly eliminated manual errors, and freed up our team to focus on what actually moves cases forward. It's been transformative."
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>Managing Partner</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Personal Injury Law Firm</div>
        </div>
      </section>

      {/* Security preview */}
      <section style={{ padding: "80px 40px", background: C.bgAlt }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2 }}>SECURITY</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 500, color: C.text, marginTop: 12, marginBottom: 16 }}>Enterprise-grade privacy and security</h2>
            <p style={{ color: C.textSec, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>We meet the highest industry standards for security and compliance, with all the default controls law firms expect built right in.</p>
            <button onClick={() => go("security")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "transparent", border: `1px solid ${C.accentBorder}`, color: C.accent, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              More about Security {I.arrow}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[{ icon: I.lock, t: "Enterprise Encryption" }, { icon: I.eye, t: "Zero Data Retention" }, { icon: I.check, t: "HIPAA Compliant" }, { icon: I.shield, t: "SOC 2 Type II", badge: "In Progress" }].map((item, i) => (
              <div key={i} style={{ padding: 20, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  {item.badge && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "rgba(217,119,6,0.08)", color: "#D97706", fontWeight: 600 }}>{item.badge}</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 500, color: C.text, marginBottom: 16 }}>Unlock Court-Ready AI for Your Firm</h2>
        <p style={{ color: C.textSec, fontSize: 16, marginBottom: 36 }}>Join the nation's leading personal injury firms already using TrenchLegal.</p>
        <button onClick={() => go("demo")} style={{ padding: "16px 40px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 30px rgba(45,45,45,0.2)" }}>
          Request a Demo
        </button>
      </section>
    </div>
  );
}

/* ══════ PRODUCT PAGE ══════ */
function ProductPage({ product }) {
  const { go } = usePage();
  const DemoComp = demoComponents[product.id];
  const idx = products.findIndex((p) => p.id === product.id);
  const next = products[(idx + 1) % products.length];

  return (
    <div style={{ paddingTop: 76 }}>
      <section style={{ padding: "100px 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <button onClick={() => go("home")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 40, transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = C.accent)} onMouseLeave={(e) => (e.target.style.color = C.textMuted)}>
          ← Back to Platform
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 6, background: C.accentBg, border: `1px solid ${C.accentBorder}`, marginBottom: 20 }}>
              <span style={{ color: C.accent }}>{product.icon}</span>
              <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 0.5 }}>{product.label}</span>
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 500, color: C.text, lineHeight: 1.15, marginBottom: 20 }}>{product.tagline}</h1>
            <p style={{ color: C.textSec, fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>{product.desc}</p>
            <div style={{ display: "flex", gap: 32, marginBottom: 36 }}>
              {product.stats.map((s, j) => (
                <div key={j}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 600, color: C.accent }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => go("demo")} style={{ padding: "14px 32px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(45,45,45,0.2)" }}>
              Request a Demo
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
            <DemoComp />
          </div>
        </div>
      </section>

      {/* Case Timeline Search — medical chronology only */}
      {product.id === "medical-chronology" && (
        <section style={{ padding: "80px 40px", background: C.bgAlt }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 6, background: C.accentBg, border: `1px solid ${C.accentBorder}`, marginBottom: 16 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ color: C.accent }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 0.5 }}>Instant Case Search</span>
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 500, color: C.text, marginBottom: 12 }}>Every detail at your fingertips</h2>
              <p style={{ color: C.textSec, fontSize: 15, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
                Search across the entire case timeline instantly. Filter by event type, search by provider name, ICD code, or keyword — and drill into any procedure, diagnosis, or treatment with full page references and clinical detail.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                      title: "Full-text search",
                      desc: "Search by keyword, provider name, diagnosis, ICD or CPT code — results filter in real time across every event in the chronology.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
                      title: "Filter by category",
                      desc: "Narrow results to specific event types — diagnoses, imaging, treatments, procedures, consultations, medications, or MMI — with one click.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
                      title: "Deep clinical detail",
                      desc: "Expand any event to see provider notes, treatment specifics, clinical findings, ICD/CPT codes, and exact page references back to source records.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                      title: "Complete timeline view",
                      desc: "See every step of the case from ER admission through MMI — treatments, gaps, escalations, and medication history mapped chronologically.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                      title: "Spot gaps instantly",
                      desc: "Identify missing records, treatment gaps, and inconsistencies that could weaken your case — before opposing counsel does.",
                    },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{f.title}</h4>
                        <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ChronoSearchDemo />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Editor section — demand letters only */}
      {product.id === "demand-letters" && (
        <section style={{ padding: "80px 40px", background: C.bgAlt }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 6, background: C.accentBg, border: `1px solid ${C.accentBorder}`, marginBottom: 16 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ color: C.accent }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 0.5 }}>Built-In Editor</span>
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 500, color: C.text, marginBottom: 12 }}>Your demand, your words</h2>
              <p style={{ color: C.textSec, fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
                Every AI-generated demand letter is a starting point, not a finished product. Our built-in editor gives you full control to refine language, adjust arguments, update figures, and add your firm's voice — all without leaving the platform.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
                      title: "Inline editing",
                      desc: "Click any paragraph to edit it directly. Change wording, restructure arguments, or rewrite entire sections while preserving all source citations.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                      title: "Section-by-section control",
                      desc: "Navigate between Liability, Medical Summary, Damages, Pain & Suffering, and Settlement Demand — each section editable independently.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
                      title: "Citations stay intact",
                      desc: "Every claim references its source — medical records, police reports, billing docs. Your edits preserve the citation chain so nothing gets lost.",
                    },
                    {
                      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
                      title: "Export when ready",
                      desc: "Once you're satisfied, export as a polished PDF ready to send — formatted, cited, and finalized on your terms.",
                    },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{f.title}</h4>
                        <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <DemandEditorDemo />
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, color: C.text, textAlign: "center", marginBottom: 48 }}>How it works</h2>
          {[
            { step: "01", title: "Upload your files", desc: "Drag and drop case files, medical records, or intake forms. We accept PDF, DOCX, TIFF, and more." },
            { step: "02", title: "AI processes everything", desc: "Our engine reads, categorizes, and extracts key information from every page automatically." },
            { step: "03", title: "Review & export", desc: "Get structured, cited outputs ready for your workflow. Edit, refine, and export in the format you need." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 24, padding: "28px 0", borderBottom: i < 2 ? `1px solid ${C.borderSubtle}` : "none" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 600, color: C.bgWarm, minWidth: 60 }}>{s.step}</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 40px 100px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>Next feature</p>
        <button onClick={() => { go(next.id); window.scrollTo(0, 0); }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--serif)", fontSize: 28, fontWeight: 500, color: C.accent, transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          {next.label} {I.arrow}
        </button>
      </section>
    </div>
  );
}

/* ══════ SECURITY PAGE ══════ */
function SecurityPage() {
  const { go } = usePage();
  const badges = [
    { icon: I.lock, title: "Enterprise Encryption", desc: "AES-256 encryption at rest and TLS 1.3 in transit. Your data is protected with the same standards used by financial institutions." },
    { icon: I.eye, title: "Zero Data Retention", desc: "We never store your data beyond what's needed to deliver results. Source files can be purged on your schedule." },
    { icon: I.server, title: "No AI Model Training", desc: "Your case files and client information are never used to train AI models. Your data stays yours — period." },
    { icon: I.check, title: "HIPAA Compliant", desc: "We are fully HIPAA compliant with signed Business Associate Agreements. All protected health information is handled according to the strictest federal standards." },
    { icon: I.shield, title: "SOC 2 Type II", desc: "We are actively pursuing SOC 2 Type II compliance to ensure our infrastructure meets the highest standards for security, availability, and confidentiality.", inProgress: true },
  ];
  const controls = [
    "Role-based access controls with full audit logging",
    "Single sign-on (SSO) via SAML 2.0",
    "IP allowlisting for firm-level network restrictions",
    "Automated data lifecycle management & purging",
    "Dedicated security team with 24/7 incident response",
    "Regular third-party penetration testing",
    "Compliant with state bar ethical obligations",
  ];

  return (
    <div style={{ paddingTop: 76 }}>
      <section style={{ padding: "100px 40px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(45,45,45,0.05), transparent 50%)", pointerEvents: "none" }} />
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2 }}>SECURITY</span>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 500, color: C.text, marginTop: 16, marginBottom: 16 }}>Your data deserves<br />the highest standard</h1>
        <p style={{ color: C.textSec, fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
          We meet the highest industry standards for security and compliance. Every control law firms expect is built in by default — not sold as an add-on.
        </p>
      </section>

      <section style={{ padding: "0 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
          {badges.map((b, i) => (
            <div key={i} style={{ padding: 28, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", width: "calc(33.333% - 14px)", minWidth: 240 }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.accentBg, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>{b.icon}</div>
                {b.inProgress && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(217,119,6,0.08)", color: "#D97706", fontWeight: 600 }}>In Progress</span>}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 40px", background: C.bgAlt }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2 }}>INFRASTRUCTURE</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, color: C.text, marginTop: 12, marginBottom: 20 }}>Built secure from the ground up</h2>
            <p style={{ color: C.textSec, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              Our infrastructure is designed around the principle that security is not a feature — it's the foundation. Every layer of our stack is architected for confidentiality and compliance.
            </p>
            <p style={{ color: C.textSec, fontSize: 14, lineHeight: 1.7 }}>
              Your ethical obligations as attorneys require absolute confidence in how client data is handled. We don't just meet that bar — we set it.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {controls.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 8 }}>
                <span style={{ color: C.green, flexShrink: 0 }}>{I.check}</span>
                <span style={{ fontSize: 13, color: C.text }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, color: C.text, marginBottom: 48 }}>How your data flows</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {[
              { label: "Upload", sub: "TLS 1.3 encrypted", color: C.blue },
              { label: "Process", sub: "Isolated environment", color: C.accent },
              { label: "Deliver", sub: "Encrypted output", color: C.green },
              { label: "Purge", sub: "On your schedule", color: C.purple },
            ].map((s, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${s.color}30`, background: `${s.color}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</span>
                </div>
                {i < 3 && <div style={{ width: 50, height: 2, background: `linear-gradient(90deg, ${C.bgWarm}, ${C.textMuted}40, ${C.bgWarm})`, margin: "0 4px", marginBottom: 32 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 40px 120px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 500, color: C.text, marginBottom: 16 }}>Ready to see it in action?</h2>
        <p style={{ color: C.textSec, fontSize: 15, marginBottom: 32 }}>Let us walk you through our security architecture and answer any compliance questions.</p>
        <button onClick={() => go("demo")} style={{ padding: "14px 36px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(45,45,45,0.2)" }}>
          Request a Demo
        </button>
      </section>
    </div>
  );
}

/* ══════ ABOUT PAGE ══════ */
function AboutPage() {
  const { go } = usePage();

  const values = [
    {
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
      title: "Your Case is Our Cause",
      desc: "Each case is an important moment for someone. We treat every case as if it were our own and solve for the diverse needs of law firms, their staff, and clients.",
    },
    {
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      title: "Always Building Trust",
      desc: "The cornerstone of our business is the hard-earned trust of our clients, achieved through the quality of our work. Every interaction reflects our commitment to excellence.",
    },
    {
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
      title: "1% Better Every Day",
      desc: "Our goal is perpetual growth. We embrace feedback, learn from our mistakes, expand our capabilities, and hold ourselves to the highest standards.",
    },
    {
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      title: "Thoughtful Urgency",
      desc: "We move with purpose and speed. We recognize the pace of innovation, the value of time, and our responsibility to keep pushing forward.",
    },
  ];

  return (
    <div style={{ paddingTop: 76 }}>
      {/* Hero */}
      <section style={{ padding: "100px 40px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(45,45,45,0.04), transparent 60%)", pointerEvents: "none" }} />
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2 }}>ABOUT US</span>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 5.5vw, 60px)", fontWeight: 500, color: C.text, marginTop: 16, marginBottom: 20, lineHeight: 1.1 }}>
          We level the playing field<br />for injury victims
        </h1>
        <p style={{ color: C.textSec, fontSize: 18, maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
          TrenchLegal is on a mission to close the justice gap using technology and AI. We empower personal injury lawyers and their clients to get the outcomes they deserve — faster, more accurately, and at scale.
        </p>
        <button onClick={() => go("demo")} style={{ marginTop: 36, padding: "14px 32px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(45,45,45,0.15)" }}>
          Request a Demo
        </button>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2 }}>OUR VALUES</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 500, color: C.text, marginTop: 12, marginBottom: 48 }}>Do great work with us</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {values.map((v, i) => (
              <div key={i} style={{ padding: 32, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "border-color 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accentBorder)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.borderSubtle)}>
                <div style={{ color: C.accent, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px 120px", textAlign: "center", background: C.bgAlt }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 500, color: C.text, marginBottom: 16 }}>Ready to join the future of legal AI?</h2>
        <p style={{ color: C.textSec, fontSize: 15, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>See how TrenchLegal can help your firm prepare cases faster, reduce errors, and win more for your clients.</p>
        <button onClick={() => go("demo")} style={{ padding: "14px 36px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(45,45,45,0.15)" }}>
          Request a Demo
        </button>
      </section>
    </div>
  );
}

/* ── Blog illustration generator ── */
function getIllustration(tag, color, size) {
  const c = color;
  const illustrations = {
    "Mass Torts": (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <rect x="38" y="30" width="44" height="60" rx="4" fill={c} opacity="0.15"/>
        <rect x="38" y="30" width="44" height="16" rx="4" fill={c} opacity="0.3"/>
        <rect x="42" y="26" width="36" height="8" rx="3" fill={c} opacity="0.25"/>
        <rect x="46" y="56" width="28" height="2" rx="1" fill={c} opacity="0.3"/>
        <rect x="46" y="62" width="20" height="2" rx="1" fill={c} opacity="0.2"/>
        <rect x="46" y="68" width="24" height="2" rx="1" fill={c} opacity="0.25"/>
        <ellipse cx="28" cy="55" rx="8" ry="4" fill={c} opacity="0.2" transform="rotate(-30 28 55)"/>
        <ellipse cx="92" cy="45" rx="8" ry="4" fill={c} opacity="0.15" transform="rotate(20 92 45)"/>
        <path d="M60 94 L52 106 L68 106 Z" fill="none" stroke={c} strokeWidth="2" opacity="0.4"/>
      </svg>
    ),
    "Legislation": (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <rect x="30" y="45" width="60" height="45" rx="4" fill={c} opacity="0.12"/>
        <rect x="30" y="45" width="60" height="10" rx="4" fill={c} opacity="0.2"/>
        <rect x="52" y="42" width="16" height="8" rx="2" fill={c} opacity="0.15"/>
        <rect x="45" y="22" width="30" height="28" rx="2" fill={c} opacity="0.18"/>
        <rect x="50" y="28" width="18" height="2" rx="1" fill={c} opacity="0.25"/>
        <rect x="50" y="33" width="14" height="2" rx="1" fill={c} opacity="0.2"/>
        <polyline points="49 34 52 37 58 30" stroke={c} strokeWidth="1.5" fill="none" opacity="0.3"/>
        <rect x="82" y="60" width="20" height="6" rx="3" fill={c} opacity="0.2" transform="rotate(-45 92 63)"/>
        <rect x="94" y="72" width="4" height="14" rx="2" fill={c} opacity="0.15"/>
        <rect x="90" y="86" width="12" height="4" rx="2" fill={c} opacity="0.12"/>
      </svg>
    ),
    "Industry": (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <rect x="20" y="70" width="14" height="30" rx="2" fill={c} opacity="0.15"/>
        <rect x="38" y="55" width="14" height="45" rx="2" fill={c} opacity="0.2"/>
        <rect x="56" y="42" width="14" height="58" rx="2" fill={c} opacity="0.25"/>
        <rect x="74" y="30" width="14" height="70" rx="2" fill={c} opacity="0.3"/>
        <rect x="92" y="20" width="14" height="80" rx="2" fill={c} opacity="0.35"/>
        <polyline points="27 65 45 50 63 38 81 26 99 16" stroke={c} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
        <path d="M99 16 L95 22 M99 16 L103 22" stroke={c} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
        <text x="58" y="18" fontSize="14" fill={c} opacity="0.3" fontWeight="700" fontFamily="var(--serif)">$</text>
        <line x1="16" y1="100" x2="110" y2="100" stroke={c} strokeWidth="1" opacity="0.15"/>
        <line x1="16" y1="20" x2="16" y2="100" stroke={c} strokeWidth="1" opacity="0.15"/>
      </svg>
    ),
    "Case Analysis": (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <path d="M25 60 L55 55 L75 35 L80 37 L65 57 L95 55 L100 50 L103 52 L98 60 L103 68 L100 70 L95 65 L65 63 L80 83 L75 85 L55 65 L25 60Z" fill={c} opacity="0.15" stroke={c} strokeWidth="1" />
        <rect x="16" y="75" width="28" height="34" rx="3" fill={c} opacity="0.12"/>
        <rect x="20" y="80" width="18" height="2" rx="1" fill={c} opacity="0.2"/>
        <rect x="20" y="85" width="14" height="2" rx="1" fill={c} opacity="0.15"/>
        <rect x="20" y="90" width="20" height="2" rx="1" fill={c} opacity="0.18"/>
        <rect x="78" y="82" width="22" height="5" rx="2.5" fill={c} opacity="0.2" transform="rotate(-30 89 85)"/>
        <rect x="96" y="90" width="4" height="12" rx="2" fill={c} opacity="0.15"/>
      </svg>
    ),
    "Technology": (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <path d="M60 25 Q45 25 40 35 Q32 33 30 40 Q25 42 25 50 Q22 55 25 62 Q25 70 32 75 Q35 82 42 82 Q45 88 55 88 L60 88" fill="none" stroke={c} strokeWidth="1.5" opacity="0.2"/>
        <path d="M60 25 Q75 25 80 35 Q88 33 90 40 Q95 42 95 50 Q98 55 95 62 Q95 70 88 75 Q85 82 78 82 Q75 88 65 88 L60 88" fill="none" stroke={c} strokeWidth="1.5" opacity="0.2"/>
        <line x1="60" y1="30" x2="60" y2="85" stroke={c} strokeWidth="1" opacity="0.12"/>
        <circle cx="60" cy="42" r="3" fill={c} opacity="0.2"/>
        <circle cx="60" cy="58" r="3" fill={c} opacity="0.2"/>
        <circle cx="60" cy="74" r="3" fill={c} opacity="0.2"/>
        <line x1="60" y1="42" x2="42" y2="42" stroke={c} strokeWidth="1" opacity="0.15"/>
        <line x1="60" y1="42" x2="78" y2="42" stroke={c} strokeWidth="1" opacity="0.15"/>
        <line x1="60" y1="58" x2="38" y2="58" stroke={c} strokeWidth="1" opacity="0.15"/>
        <line x1="60" y1="58" x2="82" y2="58" stroke={c} strokeWidth="1" opacity="0.15"/>
        <circle cx="42" cy="42" r="2" fill={c} opacity="0.25"/>
        <circle cx="78" cy="42" r="2" fill={c} opacity="0.25"/>
        <circle cx="38" cy="58" r="2" fill={c} opacity="0.25"/>
        <circle cx="82" cy="58" r="2" fill={c} opacity="0.25"/>
        <rect x="40" y="95" width="40" height="18" rx="3" fill={c} opacity="0.1"/>
        <rect x="46" y="100" width="22" height="2" rx="1" fill={c} opacity="0.2"/>
        <rect x="46" y="105" width="16" height="2" rx="1" fill={c} opacity="0.15"/>
      </svg>
    ),
    "Legal Trends": (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <path d="M60 20 Q40 20 35 40 Q32 52 36 60 Q30 65 32 72 Q34 78 40 78 L40 85 Q40 90 50 90 L70 90 Q80 90 80 85 L80 78 Q86 78 88 72 Q90 65 84 60 Q88 52 85 40 Q80 20 60 20Z" fill={c} opacity="0.08" stroke={c} strokeWidth="1.2" opacity="0.18"/>
        <path d="M48 40 Q55 35 62 40" stroke={c} strokeWidth="1.2" fill="none" opacity="0.2"/>
        <path d="M45 48 Q55 42 68 48" stroke={c} strokeWidth="1.2" fill="none" opacity="0.18"/>
        <path d="M48 56 Q58 50 65 56" stroke={c} strokeWidth="1.2" fill="none" opacity="0.15"/>
        <path d="M55 65 Q55 60 60 62 Q65 60 65 65 Q65 70 60 74 Q55 70 55 65Z" fill={c} opacity="0.2"/>
        <line x1="60" y1="95" x2="60" y2="108" stroke={c} strokeWidth="1.5" opacity="0.15"/>
        <line x1="48" y1="95" x2="72" y2="95" stroke={c} strokeWidth="1.5" opacity="0.15"/>
        <path d="M48 95 L45 102 L51 102 Z" fill={c} opacity="0.12"/>
        <path d="M72 95 L69 102 L75 102 Z" fill={c} opacity="0.12"/>
      </svg>
    ),
  };
  return illustrations[tag] || illustrations["Industry"];
}

/* ══════ BLOG PAGE ══════ */
function BlogPage() {
  const { go } = usePage();
  const [activeTag, setActiveTag] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const colorMap = { purple: C.purple, blue: C.blue, green: C.green, red: C.red, accent: C.accent, amber: "#D97706" };
  const resolveColor = (c) => colorMap[c] || C.accent;

  useEffect(() => {
    fetch("/posts.json")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tags = ["all", "Mass Torts", "Legislation", "Industry", "Case Analysis", "Technology", "Legal Trends"];
  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tag === activeTag);
  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  const tagBg = (t) => {
    const p = posts.find((x) => x.tag === t);
    return p ? `${resolveColor(p.color)}10` : C.accentBg;
  };
  const tagColor = (t) => {
    const p = posts.find((x) => x.tag === t);
    return p ? resolveColor(p.color) : C.accent;
  };

  if (selectedPost) {
    const sc = resolveColor(selectedPost.color);
    const bodyParagraphs = selectedPost.body ? selectedPost.body.split("\n\n").filter(Boolean) : [];
    return (
      <div style={{ paddingTop: 76 }}>
        <section style={{ padding: "60px 40px 0" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <button onClick={() => setSelectedPost(null)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 32, transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = C.accent)} onMouseLeave={(e) => (e.target.style.color = C.textMuted)}>
              ← Back to Blog
            </button>
          </div>
        </section>

        <section style={{ padding: "0 40px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: `${sc}12`, color: sc, fontWeight: 600 }}>{selectedPost.tag}</span>
              <span style={{ fontSize: 13, color: C.textMuted }}>{selectedPost.date}</span>
              <span style={{ fontSize: 13, color: C.textMuted }}>· {selectedPost.readTime}</span>
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 500, color: C.text, lineHeight: 1.25, marginBottom: 24 }}>{selectedPost.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 28, borderBottom: `1px solid ${C.borderSubtle}`, marginBottom: 36 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.accent }}>TL</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>TrenchLegal Team</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Legal Intelligence & Research</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "0 40px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{ padding: 40, background: `linear-gradient(135deg, ${sc}08, ${sc}04)`, borderRadius: 16, border: `1px solid ${sc}15` }}>
              {getIllustration(selectedPost.tag, sc, 180)}
            </div>
          </div>
        </section>

        <section style={{ padding: "0 40px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontSize: 18, color: C.text, lineHeight: 1.8, marginBottom: 24, fontFamily: "var(--serif)" }}>{selectedPost.excerpt}</p>
            {bodyParagraphs.length > 0 ? (
              bodyParagraphs.map((para, i) => (
                <p key={i} style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 20 }}>{para}</p>
              ))
            ) : (
              <>
                <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 20 }}>
                  This is an evolving area of personal injury law that carries significant implications for firms handling related claims. As the legal landscape continues to shift, staying informed on developments like these is critical to case strategy and client outcomes.
                </p>
                <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 20 }}>
                  For personal injury attorneys, the key takeaway is clear: proactive case preparation — powered by the right tools and up-to-date legal intelligence — remains the single most important factor in achieving favorable results for clients.
                </p>
                <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 20 }}>
                  Firms that invest in structured workflows, AI-assisted document review, and streamlined intake processes are consistently outperforming those relying on manual methods alone. The data supports this: practices leveraging technology report significantly faster case turnaround times and higher settlement values.
                </p>
                <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 32 }}>
                  At TrenchLegal, we're committed to helping PI firms navigate these changes with confidence. Our platform is built to support every stage of the case lifecycle — from intake through settlement — so your team can focus on what matters most: winning for your clients.
                </p>
              </>
            )}

            <div style={{ padding: 28, background: C.accentBg, borderRadius: 14, border: `1px solid ${C.accentBorder}`, marginBottom: 40 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 8 }}>See how TrenchLegal can help your firm</h3>
              <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 16 }}>From AI-powered demand letters to instant medical chronologies, discover how leading PI firms are preparing cases faster.</p>
              <button onClick={() => go("demo")} style={{ padding: "10px 24px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Request a Demo
              </button>
            </div>

            <div style={{ paddingTop: 28, borderTop: `1px solid ${C.borderSubtle}`, marginBottom: 60 }}>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>More from the blog</p>
              <div style={{ display: "flex", gap: 16 }}>
                {posts.filter((p) => p.id !== selectedPost.id).slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => { setSelectedPost(p); window.scrollTo(0, 0); }} style={{ flex: 1, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "border-color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accentBorder)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.borderSubtle)}>
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: `${resolveColor(p.color)}10`, color: resolveColor(p.color), fontWeight: 600 }}>{p.tag}</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 8, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{p.date}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 76 }}>
      {/* Hero */}
      <section style={{ padding: "80px 40px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(45,45,45,0.04), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2 }}>BLOG</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 500, color: C.text, marginTop: 12, marginBottom: 12 }}>Notes from Our Blog</h1>
          <p style={{ color: C.textSec, fontSize: 16, maxWidth: 560, lineHeight: 1.7 }}>Insights, case analysis, and industry trends for personal injury firms navigating the evolving legal landscape.</p>
        </div>
      </section>

      {/* Tags */}
      <section style={{ padding: "0 40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tags.map((t) => (
            <button key={t} onClick={() => setActiveTag(t)} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 100, border: `1px solid ${activeTag === t ? tagColor(t) : C.borderSubtle}`, background: activeTag === t ? tagBg(t) : "transparent", color: activeTag === t ? tagColor(t) : C.textMuted, cursor: "pointer", fontWeight: 500, fontFamily: "inherit", textTransform: "capitalize", transition: "all 0.2s" }}>{t}</button>
          ))}
        </div>
      </section>

      {loading ? (
        <div style={{ padding: "80px 40px", textAlign: "center", color: C.textMuted }}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={{ padding: "80px 40px", textAlign: "center", color: C.textMuted }}>No posts yet.</div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <section style={{ padding: "0 40px 48px" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div onClick={() => { setSelectedPost(featured); window.scrollTo(0, 0); }} style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, overflow: "hidden", display: "grid", gridTemplateColumns: "1.2fr 1fr", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}>
                  <div style={{ background: `linear-gradient(135deg, ${resolveColor(featured.color)}12, ${resolveColor(featured.color)}06)`, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280, padding: 40 }}>
                    {getIllustration(featured.tag, resolveColor(featured.color), 160)}
                  </div>
                  <div style={{ padding: "36px 36px 32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${resolveColor(featured.color)}12`, color: resolveColor(featured.color), fontWeight: 600 }}>{featured.tag}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{featured.date}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>· {featured.readTime}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, color: C.text, lineHeight: 1.3, marginBottom: 14 }}>{featured.title}</h2>
                    <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7 }}>{featured.excerpt}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 20, fontSize: 13, color: C.accent, fontWeight: 500 }}>
                      Read more {I.arrow}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Post grid */}
          <section style={{ padding: "0 40px 80px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {rest.map((post) => {
                  const pc = resolveColor(post.color);
                  return (
                    <div key={post.id} onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }} style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}>
                      <div style={{ height: 160, background: `linear-gradient(135deg, ${pc}10, ${pc}05)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {getIllustration(post.tag, pc, 100)}
                      </div>
                      <div style={{ padding: "18px 20px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${pc}10`, color: pc, fontWeight: 600 }}>{post.tag}</span>
                          <span style={{ fontSize: 10, color: C.textMuted }}>{post.date}</span>
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.35, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</h3>
                        <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.borderSubtle}` }}>
                          <span style={{ fontSize: 11, color: C.textMuted }}>{post.readTime}</span>
                          <span style={{ fontSize: 12, color: C.accent, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>Read {I.arrow}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section style={{ padding: "60px 40px 100px", textAlign: "center", background: C.bgAlt }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, color: C.text, marginBottom: 12 }}>Stay ahead of the curve</h2>
        <p style={{ color: C.textSec, fontSize: 15, marginBottom: 32 }}>See how TrenchLegal helps PI firms prepare cases faster with AI.</p>
        <button onClick={() => go("demo")} style={{ padding: "14px 36px", borderRadius: 8, background: "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(45,45,45,0.15)" }}>
          Request a Demo
        </button>
      </section>
    </div>
  );
}

/* ══════ DEMO PAGE ══════ */
function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", firm: "", email: "", size: "" });

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError("Please fill in at least your name and email."); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "bd95d7a3-d0f3-4eae-a61d-4c0dc670b68d",
          subject: "New Demo Request from " + form.name,
          from_name: "TrenchLegal Website",
          name: form.name,
          email: form.email,
          firm: form.firm,
          firm_size: form.size,
        }),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); } else { setError("Something went wrong. Please try again."); }
    } catch (e) { setError("Network error. Please try again."); }
    setSending(false);
  };

  return (
    <div style={{ paddingTop: 76, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 500, width: "100%", padding: "60px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 500, color: C.text, marginBottom: 12 }}>Request a Demo</h1>
          <p style={{ color: C.textSec, fontSize: 15 }}>See how TrenchLegal can transform your firm's case preparation workflow.</p>
        </div>
        {!submitted ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "name", label: "Full Name", ph: "Jane Smith" },
              { key: "firm", label: "Firm Name", ph: "Smith & Associates" },
              { key: "email", label: "Work Email", ph: "jane@smithlaw.com" },
              { key: "size", label: "Firm Size", ph: "1-10, 11-50, 50+" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: C.textSec, fontWeight: 500, display: "block", marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }} onFocus={(e) => (e.target.style.borderColor = C.accent)} onBlur={(e) => (e.target.style.borderColor = C.borderSubtle)} />
              </div>
            ))}
            {error && <div style={{ fontSize: 13, color: C.red, padding: "8px 12px", background: C.redBg, borderRadius: 8 }}>{error}</div>}
            <button onClick={handleSubmit} disabled={sending} style={{ marginTop: 8, padding: "14px", borderRadius: 8, background: sending ? "#666" : "linear-gradient(135deg, #2D2D2D, #1A1A1A)", border: "none", color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: sending ? 0.7 : 1, transition: "opacity 0.2s" }}>
              {sending ? "Sending..." : "Submit Request"}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 40, background: C.bgCard, borderRadius: 14, border: `1px solid rgba(45,122,58,0.2)`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.green }}>{I.check}</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 8 }}>Thank you!</h3>
            <p style={{ fontSize: 14, color: C.textSec }}>Our team will reach out within 24 hours to schedule your personalized demo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════ FOOTER ══════ */
function Footer() {
  const { go } = usePage();
  return (
    <footer style={{ padding: "60px 40px 40px", borderTop: `1px solid ${C.border}`, background: C.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 60, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M16 1.5 L3.5 6.5 L3.5 16 Q3.5 25.5 16 30.5 Q28.5 25.5 28.5 16 L28.5 6.5 Z" fill="none" stroke="#2D2D2D" strokeWidth="1.5"/>
                <line x1="6" y1="10" x2="10" y2="10" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.3"/>
                <line x1="22" y1="10" x2="26" y2="10" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.3"/>
                <line x1="6" y1="18" x2="8.5" y2="18" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
                <line x1="23.5" y1="18" x2="26" y2="18" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
                <line x1="6" y1="10" x2="6" y2="14" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
                <line x1="26" y1="10" x2="26" y2="14" stroke="#2D2D2D" strokeWidth="0.7" opacity="0.25"/>
                <circle cx="6" cy="10" r="1.2" fill="#2D2D2D" opacity="0.35"/>
                <circle cx="26" cy="10" r="1.2" fill="#2D2D2D" opacity="0.35"/>
                <circle cx="6" cy="14" r="0.9" fill="#2D2D2D" opacity="0.25"/>
                <circle cx="26" cy="14" r="0.9" fill="#2D2D2D" opacity="0.25"/>
                <circle cx="6" cy="18" r="0.9" fill="#2D2D2D" opacity="0.25"/>
                <circle cx="26" cy="18" r="0.9" fill="#2D2D2D" opacity="0.25"/>
                <rect x="14" y="9" width="4" height="14" rx="1" fill="#2D2D2D"/>
                <rect x="7" y="7.5" width="18" height="3" rx="1.2" fill="#2D2D2D"/>
                <path d="M9 12.5 L7 17 Q6.5 18 7.8 18 L10.2 18 Q11.5 18 11 17 Z" fill="#2D2D2D" opacity="0.85"/>
                <path d="M23 12.5 L21 17 Q20.5 18 21.8 18 L24.2 18 Q25.5 18 25 17 Z" fill="#2D2D2D" opacity="0.85"/>
                <line x1="9" y1="10.5" x2="9" y2="12.5" stroke="#2D2D2D" strokeWidth="0.8" opacity="0.7"/>
                <line x1="23" y1="10.5" x2="23" y2="12.5" stroke="#2D2D2D" strokeWidth="0.8" opacity="0.7"/>
                <rect x="11" y="22.5" width="10" height="2" rx="1" fill="#2D2D2D" opacity="0.5"/>
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, color: C.text, letterSpacing: 1 }}>TRENCH</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 8, fontWeight: 600, color: C.textMuted, letterSpacing: 3.5, textTransform: "uppercase", marginTop: -1 }}>{" "}Legal</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: C.textMuted, maxWidth: 260, lineHeight: 1.6 }}>AI-powered case preparation for the nation's leading personal injury firms.</p>
        </div>
        {[
          { title: "Product", links: products.map((p) => ({ label: p.label, id: p.id })) },
          { title: "Resources", links: [{ label: "Blog", id: "blog" }, { label: "Security", id: "security" }] },
          { title: "Company", links: [{ label: "About Us", id: "about" }, { label: "Request a Demo", id: "demo" }] },
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>{col.title}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {col.links.map((l) => (
                <button key={l.id} onClick={() => { go(l.id); window.scrollTo(0, 0); }} style={{ background: "none", border: "none", color: C.textSec, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left", padding: 0, transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = C.accent)} onMouseLeave={(e) => (e.target.style.color = C.textSec)}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: "40px auto 0", paddingTop: 20, borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted }}>
        © 2026 TrenchLegal AI, Inc. All rights reserved.
      </div>
    </footer>
  );
}

/* ══════ APP ══════ */
export default function App() {
  const [page, setPage] = useState("home");
  const go = useCallback((p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const product = products.find((p) => p.id === page);

  return (
    <RouteCtx.Provider value={{ page, go }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root { --serif: 'Cormorant Garamond', Georgia, serif; --sans: 'DM Sans', system-ui, sans-serif; }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { width: 100%; overflow-x: hidden; }
        body { width: 100%; margin: 0; padding: 0; overflow-x: hidden; background: #F5F5F5; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        #root, #__next { width: 100%; margin: 0; padding: 0; overflow-x: hidden; }
        img, video { display: block; max-width: 100%; }
        button { font: inherit; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        ::selection { background: rgba(45,45,45,0.15); }
      `}</style>
      <div style={{ background: C.bg, color: C.text, fontFamily: "var(--sans)", minHeight: "100vh", width: "100%", overflowX: "hidden", WebkitFontSmoothing: "antialiased" }}>
        <Nav />
        {page === "home" && <HomePage />}
        {page === "security" && <SecurityPage />}
        {page === "about" && <AboutPage />}
        {page === "blog" && <BlogPage />}
        {page === "demo" && <DemoPage />}
        {product && <ProductPage product={product} />}
        <Footer />
      </div>
    </RouteCtx.Provider>
  );
}
