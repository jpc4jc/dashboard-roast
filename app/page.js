"use client";
import { useState, useRef, useCallback } from "react";

const ACCENT = "#FF4D1C";
const ACCENT2 = "#FFB800";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0A0A0A;
    color: #F0EDE6;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  :root {
    --accent: #FF4D1C;
    --accent2: #FFB800;
    --bg: #0A0A0A;
    --surface: #141414;
    --surface2: #1E1E1E;
    --border: #2A2A2A;
    --text: #F0EDE6;
    --muted: #888;
  }

  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .app { max-width: 900px; margin: 0 auto; padding: 0 24px; }

  .header {
    padding: 40px 0 0;
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 3px; color: var(--accent);
  }
  .badge {
    font-family: 'DM Mono', monospace; font-size: 11px;
    background: var(--surface2); border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 2px; color: var(--muted);
    letter-spacing: 1px;
  }

  .hero { padding: 60px 0 48px; }
  .hero-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--accent); letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .hero h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 10vw, 110px);
    line-height: 0.9; letter-spacing: 2px;
    color: var(--text);
  }
  .hero h1 span { color: var(--accent); }
  .hero-sub {
    margin-top: 24px; font-size: 17px; color: var(--muted);
    font-weight: 300; max-width: 520px; line-height: 1.6;
  }

  .divider { height: 1px; background: var(--border); margin: 0 0 48px; }

  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 4px; padding: 56px 40px;
    text-align: center; cursor: pointer;
    transition: all 0.2s ease;
    background: var(--surface);
    position: relative; overflow: hidden;
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent); background: #1A1010;
  }
  .upload-zone.drag-over { transform: scale(1.01); }
  .upload-icon {
    width: 48px; height: 48px; margin: 0 auto 16px;
    border: 2px solid var(--border); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .upload-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 28px;
    letter-spacing: 2px; margin-bottom: 8px;
  }
  .upload-sub { font-size: 13px; color: var(--muted); }
  .upload-formats {
    margin-top: 16px; font-family: 'DM Mono', monospace;
    font-size: 11px; color: var(--border); letter-spacing: 1px;
  }

  .preview-wrap {
    position: relative; border-radius: 4px; overflow: hidden;
    border: 1px solid var(--border); background: var(--surface);
  }
  .preview-wrap img {
    width: 100%; display: block; max-height: 400px; object-fit: contain;
    background: #111;
  }
  .preview-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8) 100%);
  }
  .preview-actions {
    position: absolute; bottom: 16px; right: 16px; display: flex; gap: 8px;
  }

  .btn {
    font-family: 'DM Mono', monospace; font-size: 12px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 12px 24px; border: none; cursor: pointer;
    transition: all 0.15s ease; border-radius: 2px;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #ff6340; transform: translateY(-1px); }
  .btn-primary:disabled { background: #444; color: #666; cursor: not-allowed; transform: none; }
  .btn-ghost {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--muted); color: var(--text); }
  .btn-large { width: 100%; padding: 18px; font-size: 14px; margin-top: 24px; letter-spacing: 3px; }

  .analyzing { text-align: center; padding: 80px 40px; }
  .pulse-ring {
    width: 80px; height: 80px; border-radius: 50%;
    border: 3px solid var(--accent);
    margin: 0 auto 32px;
    animation: pulse 1.4s ease-in-out infinite;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.08); opacity: 0.7; }
  }
  .analyzing-label {
    font-family: 'Bebas Neue', sans-serif; font-size: 32px;
    letter-spacing: 4px; color: var(--text); margin-bottom: 8px;
  }
  .analyzing-sub {
    font-family: 'DM Mono', monospace; font-size: 12px;
    color: var(--muted); letter-spacing: 1px;
  }
  .progress-bar {
    width: 200px; height: 2px; background: var(--border);
    margin: 24px auto 0; border-radius: 1px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: var(--accent);
    animation: progress 2.5s ease-in-out infinite;
  }
  @keyframes progress {
    0% { width: 0%; margin-left: 0; }
    50% { width: 60%; }
    100% { width: 0%; margin-left: 100%; }
  }

  .results { padding-bottom: 80px; }
  .results-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 24px;
    padding: 32px 0 24px; flex-wrap: wrap;
  }
  .score-block { text-align: right; }
  .score-label {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--muted); letter-spacing: 2px; margin-bottom: 4px;
  }
  .score-number {
    font-family: 'Bebas Neue', sans-serif; font-size: 72px;
    line-height: 1; color: var(--accent2);
  }
  .score-max { font-family: 'DM Mono', monospace; font-size: 14px; color: var(--muted); }
  .results-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 48px;
    line-height: 0.95; letter-spacing: 2px;
  }
  .results-verdict {
    font-size: 15px; color: var(--muted); margin-top: 8px;
    font-weight: 300; max-width: 400px; line-height: 1.5;
  }

  .section { margin-bottom: 32px; }
  .section-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .section-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot-red { background: #FF4D4D; }
  .dot-yellow { background: var(--accent2); }
  .dot-green { background: #4DFF91; }
  .section-title {
    font-family: 'DM Mono', monospace; font-size: 12px;
    letter-spacing: 2px; text-transform: uppercase; color: var(--text);
  }
  .section-count { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }

  .issue-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 3px; padding: 16px 20px; margin-bottom: 8px;
    border-left: 3px solid transparent;
  }
  .issue-card.critical { border-left-color: #FF4D4D; }
  .issue-card.warning { border-left-color: var(--accent2); }
  .issue-card.good { border-left-color: #4DFF91; }
  .issue-title { font-size: 14px; font-weight: 500; margin-bottom: 4px; color: var(--text); }
  .issue-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }

  .rec-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 3px; padding: 16px 20px; margin-bottom: 8px;
    display: flex; gap: 16px; align-items: flex-start;
  }
  .rec-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 28px;
    color: var(--border); line-height: 1; flex-shrink: 0; width: 28px;
  }
  .rec-title { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .rec-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }

  .layout-box {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 3px; padding: 24px;
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: #aaa; line-height: 1.8; white-space: pre-wrap;
  }

  .share-strip {
    margin-top: 40px; padding: 24px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 3px; display: flex;
    align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
  }
  .share-text { font-size: 14px; color: var(--muted); }
  .share-text strong { color: var(--text); }
  .share-btns { display: flex; gap: 8px; flex-wrap: wrap; }

  .error-box {
    background: #1A0A0A; border: 1px solid #FF4D4D;
    border-radius: 3px; padding: 20px 24px;
    font-family: 'DM Mono', monospace; font-size: 13px; color: #FF8080;
  }
`;

function parseAnalysis(text) {
  let score = 5;
  const scoreMatch = text.match(/\b([1-9]|10)\/10\b/);
  if (scoreMatch) score = parseInt(scoreMatch[1]);

  const result = {
    score,
    verdict: "",
    criticalIssues: [],
    warnings: [],
    positives: [],
    recommendations: [],
    layoutSuggestion: "",
  };

  const HEADERS = [
    { key: "verdict",          re: /^#{0,3}\s*verdict\s*$/i },
    { key: "criticalIssues",   re: /^#{0,3}\s*critical/i },
    { key: "warnings",         re: /^#{0,3}\s*warning/i },
    { key: "positives",        re: /^#{0,3}\s*(positive|what works|strength)/i },
    { key: "recommendations",  re: /^#{0,3}\s*(recommendation|action plan|fix it)/i },
    { key: "layoutSuggestion", re: /^#{0,3}\s*layout/i },
  ];

  const lines = text.split("\n");
  let currentKey = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.length < 60) {
      const header = HEADERS.find(h => h.re.test(line));
      if (header) { currentKey = header.key; continue; }
    }
    if (!currentKey) continue;
    const clean = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
    if (currentKey === "verdict" || currentKey === "layoutSuggestion") {
      if (!/^\d+\/10/.test(clean)) result[currentKey] += clean + "\n";
    } else {
      if (/^[-•*]\s|^\d+[.)\s]/.test(line)) {
        const item = clean.replace(/^[-•*\d][.)\s]*/, "").trim();
        if (item.length > 4) result[currentKey].push(item);
      }
    }
  }

  if (result.recommendations.length === 0) {
    const allItems = lines
      .filter(l => /^\s*[-•*]\s|^\s*\d+[.)\s]/.test(l))
      .map(l => l.trim().replace(/^[-•*\d][.)\s]*/, "").replace(/\*\*/g, "").trim())
      .filter(l => l.length > 4);
    if (allItems.length > 0) {
      const half = Math.ceil(allItems.length / 2);
      if (result.criticalIssues.length === 0) result.criticalIssues = allItems.slice(0, half);
      result.recommendations = allItems.slice(half);
    }
  }

  result.verdict = result.verdict.trim();
  result.layoutSuggestion = result.layoutSuggestion.trim();
  return result;
}

function splitIssue(text) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 3 && colonIdx < 50) {
    return { title: text.slice(0, colonIdx), desc: text.slice(colonIdx + 1).trim() };
  }
  const words = text.split(" ");
  return { title: words.slice(0, 5).join(" "), desc: words.slice(5).join(" ") };
}

export default function DashboardRoast() {
  const [phase, setPhase] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const analyze = async () => {
    if (!imageFile) return;
    setPhase("analyzing");
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(imageFile);
      });
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: imageFile.type || "image/png" }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(parseAnalysis(data.text));
      setPhase("results");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("upload"); setImageFile(null); setImagePreview(null);
    setAnalysis(null); setErrorMsg("");
  };

  const copyShareText = () => {
    const score = analysis?.score ?? "?";
    navigator.clipboard.writeText(
      `I ran my dashboard through Dashboard Roast and got ${score}/10 💀 Try yours at dashboardroast.io`
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="grain" />
      <div className="app">
        <header className="header">
          <div className="logo">DASHBOARD ROAST</div>
          <div className="badge">BETA · FREE</div>
        </header>

        {phase === "upload" && (
          <>
            <section className="hero">
              <div className="hero-eyebrow">// viz roast machine</div>
              <h1>YOUR DASHBOARD<br /><span>DESERVES</span><br />THE TRUTH</h1>
              <p className="hero-sub">Upload a screenshot. Get brutally honest feedback on your data visualization design — powered by AI that actually knows Tufte.</p>
            </section>
            <div className="divider" />
            {!imagePreview ? (
              <div
                className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <div className="upload-icon">📊</div>
                <div className="upload-title">Drop Your Dashboard</div>
                <p className="upload-sub">Drag & drop or click to upload a screenshot</p>
                <div className="upload-formats">PNG · JPG · WEBP · GIF</div>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <>
                <div className="preview-wrap">
                  <img src={imagePreview} alt="Dashboard preview" />
                  <div className="preview-overlay" />
                  <div className="preview-actions">
                    <button className="btn btn-ghost" onClick={reset}>Change</button>
                  </div>
                </div>
                <button className="btn btn-primary btn-large" onClick={analyze}>🔥 Roast My Dashboard</button>
              </>
            )}
          </>
        )}

        {phase === "analyzing" && (
          <div className="analyzing">
            <div className="pulse-ring">🔥</div>
            <div className="analyzing-label">Analyzing Your Dashboard</div>
            <div className="analyzing-sub">consulting the viz gods...</div>
            <div className="progress-bar"><div className="progress-fill" /></div>
          </div>
        )}

        {phase === "error" && (
          <div style={{ padding: "40px 0" }}>
            <div className="error-box">ERROR: {errorMsg}<br /><br />Make sure your ANTHROPIC_API_KEY is set correctly.</div>
            <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={reset}>← Try Again</button>
          </div>
        )}

        {phase === "results" && analysis && (
          <div className="results">
            <div style={{ paddingTop: 32, paddingBottom: 8 }}>
              <button className="btn btn-ghost" onClick={reset}>← Start Over</button>
            </div>
            <div className="results-header">
              <div>
                <div className="results-title">THE VERDICT<br />IS IN</div>
                {analysis.verdict && <p className="results-verdict">"{analysis.verdict}"</p>}
              </div>
              <div className="score-block">
                <div className="score-label">DESIGN SCORE</div>
                <div className="score-number">{analysis.score}</div>
                <div className="score-max">/10</div>
              </div>
            </div>
            <div className="divider" />

            {analysis.criticalIssues.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <div className="section-dot dot-red" />
                  <div className="section-title">Critical Issues</div>
                  <div className="section-count">{analysis.criticalIssues.length} found</div>
                </div>
                {analysis.criticalIssues.map((issue, i) => {
                  const { title, desc } = splitIssue(issue);
                  return <div key={i} className="issue-card critical"><div className="issue-title">{title}</div>{desc && <div className="issue-desc">{desc}</div>}</div>;
                })}
              </div>
            )}

            {analysis.warnings.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <div className="section-dot dot-yellow" />
                  <div className="section-title">Warnings</div>
                  <div className="section-count">{analysis.warnings.length} found</div>
                </div>
                {analysis.warnings.map((w, i) => {
                  const { title, desc } = splitIssue(w);
                  return <div key={i} className="issue-card warning"><div className="issue-title">{title}</div>{desc && <div className="issue-desc">{desc}</div>}</div>;
                })}
              </div>
            )}

            {analysis.positives.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <div className="section-dot dot-green" />
                  <div className="section-title">What Works</div>
                </div>
                {analysis.positives.map((p, i) => {
                  const { title, desc } = splitIssue(p);
                  return <div key={i} className="issue-card good"><div className="issue-title">{title}</div>{desc && <div className="issue-desc">{desc}</div>}</div>;
                })}
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div className="section" style={{ background: "#120D0A", border: "1px solid #3A2010", borderRadius: 4, padding: "24px 24px 16px" }}>
                <div className="section-header" style={{ borderBottomColor: "#3A2010" }}>
                  <div className="section-dot" style={{ background: ACCENT }} />
                  <div className="section-title" style={{ color: ACCENT }}>Action Plan — Fix It List</div>
                  <div className="section-count" style={{ color: ACCENT, opacity: 0.6 }}>{analysis.recommendations.length} steps</div>
                </div>
                {analysis.recommendations.map((rec, i) => {
                  const { title, desc } = splitIssue(rec);
                  return (
                    <div key={i} className="rec-card" style={{ background: "#1A1008", borderColor: "#3A2010", marginBottom: 10 }}>
                      <div className="rec-num" style={{ color: ACCENT, opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</div>
                      <div className="rec-content">
                        <div className="rec-title" style={{ color: "#F0EDE6" }}>{title}</div>
                        {desc && <div className="rec-desc">{desc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {analysis.layoutSuggestion && (
              <div className="section">
                <div className="section-header">
                  <div className="section-dot" style={{ background: "#888" }} />
                  <div className="section-title">Suggested Layout</div>
                </div>
                <div className="layout-box">{analysis.layoutSuggestion}</div>
              </div>
            )}

            <div className="share-strip">
              <div className="share-text"><strong>Share your roast.</strong> Let the analytics community see your score.</div>
              <div className="share-btns">
                <button className="btn btn-ghost" onClick={copyShareText}>Copy Share Text</button>
                <button className="btn btn-ghost" onClick={reset}>Roast Another →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
