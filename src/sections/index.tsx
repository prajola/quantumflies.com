/**
 * The twelve homepage sections.
 *
 * They live in one file because each is a thin arrangement of copy from
 * content.ts — splitting twelve ~20-line components across twelve files would
 * cost more in imports and navigation than it returns.
 *
 * ── SHAPE IS THE POINT ───────────────────────────────────────────────────
 * A twelve-section page whose sections are all "eyebrow, title, three cards"
 * reads as one undifferentiated scroll, and the reader stops distinguishing
 * between them by about section four. Each one here has a different shape,
 * and the shape carries meaning:
 *
 *   Problem       dark band, 2×2 — the only inverted section until the CTA
 *   How it works  numbered rail — it is a sequence, so it is drawn as one
 *   Claw / Clue   mirrored splits — a deliberate pair, enforcement/evidence
 *   Action Gate   three verdict cards, colour-coded to the verdicts
 *   Solutions     five cards, the only plain grid on the page
 *   Simulation    spec rows against a lede
 *   Fleet         three columns on a rule
 *   Architecture  a stacked layer diagram, because it describes a stack
 *   Why           sticky header beside a ruled list
 *   CTA           dark band, closing the bookend the Problem section opened
 */

import {
  PROBLEM, HOW, CLAW, GATE, SOLUTIONS, SIMULATION, CLUE, FLEET,
  ARCHITECTURE, WHY, CTA,
} from "@/content";

/** Shared section header. Left-ranged, like everything else on the page. */
function Head({
  eyebrow, title, lede, invert,
}: { eyebrow: string; title: string; lede?: string; invert?: boolean }) {
  return (
    <header className={`qf-head${invert ? " qf-head-inv" : ""}`}>
      <p className="qf-eyebrow-plain">{eyebrow}</p>
      <h2 className="qf-h2">{title}</h2>
      {lede && <p className="qf-section-lede">{lede}</p>}
    </header>
  );
}

/* ── 02 · Problem ─────────────────────────────────────────────────── */
export function Problem() {
  return (
    <section className="qf-sec qf-inv" id="problem">
      <div className="qf-wrap">
        <Head eyebrow={PROBLEM.eyebrow} title={PROBLEM.title} lede={PROBLEM.lede} invert />
        <div className="qf-prob-grid">
          {PROBLEM.items.map((it) => (
            <article key={it.title} className="qf-prob">
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 03 · How it works ────────────────────────────────────────────── */
export function HowItWorks() {
  return (
    <section className="qf-sec" id="how">
      <div className="qf-wrap">
        <Head eyebrow={HOW.eyebrow} title={HOW.title} lede={HOW.lede} />
        {/* An <ol>: the numbers are the list markers, so they are decorative
            to a screen reader rather than content it has to read twice. */}
        <ol className="qf-steps">
          {HOW.steps.map((s, i) => (
            <li key={s.tag} className="qf-step">
              <span className="qf-step-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="qf-step-tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Claw and Clue share this: same component, mirrored, because they are the
 *  two halves of one idea — enforce, then prove. */
function Module({
  data, id, mirrored,
}: {
  id: string;
  mirrored?: boolean;
  data: {
    eyebrow: string; title: string; lede: string;
    points: string[]; specs: { k: string; v: string; unverified?: boolean }[];
  };
}) {
  return (
    <section className={`qf-sec${mirrored ? " qf-mod-mirror" : ""}`} id={id}>
      <div className="qf-wrap qf-mod">
        <div className="qf-mod-copy">
          <Head eyebrow={data.eyebrow} title={data.title} lede={data.lede} />
          <ul className="qf-ticks">
            {data.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <dl className="qf-specs">
          {data.specs.map((s) => (
            <div key={s.k}>
              <dt>{s.k}</dt>
              <dd>
                {s.v}
                {s.unverified && <i className="qf-est" title="Target, not a measured figure">est.</i>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export const Claw = () => <Module id="quantumclaw" data={CLAW} />;
export const Clue = () => <Module id="quantumclue" data={CLUE} mirrored />;

/* ── 05 · Action Gate ─────────────────────────────────────────────── */
export function ActionGate() {
  return (
    <section className="qf-sec qf-tint" id="action-gate">
      <div className="qf-wrap">
        <Head eyebrow={GATE.eyebrow} title={GATE.title} lede={GATE.lede} />
        <div className="qf-verdicts">
          {GATE.verdicts.map((v) => (
            <article key={v.key} className={`qf-verdict qf-v-${v.key}`}>
              <h3>
                <span className="qf-v-dot" aria-hidden="true" />
                {v.name}
              </h3>
              <p>{v.body}</p>
            </article>
          ))}
        </div>
        <p className="qf-note">{GATE.note}</p>
      </div>
    </section>
  );
}

/* ── 06 · Solutions ───────────────────────────────────────────────── */
export function Solutions() {
  return (
    <section className="qf-sec" id="solutions">
      <div className="qf-wrap">
        <Head eyebrow={SOLUTIONS.eyebrow} title={SOLUTIONS.title} lede={SOLUTIONS.lede} />
        <div className="qf-cases">
          {SOLUTIONS.items.map((it) => (
            <article key={it.name} className="qf-case">
              <h3>{it.name}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 07 · Simulation ──────────────────────────────────────────────── */
export function Simulation() {
  return (
    <section className="qf-sec qf-tint" id="simulation">
      <div className="qf-wrap qf-split">
        <Head eyebrow={SIMULATION.eyebrow} title={SIMULATION.title} lede={SIMULATION.lede} />
        <div>
          <dl className="qf-rows">
            {SIMULATION.points.map((p) => (
              <div key={p.k}>
                <dt>{p.k}</dt>
                <dd>
                  {p.v}
                  {p.unverified && <i className="qf-est" title="Target, not a measured figure">est.</i>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="qf-note">{SIMULATION.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ── 09 · Fleet ───────────────────────────────────────────────────── */
export function Fleet() {
  return (
    <section className="qf-sec" id="fleet">
      <div className="qf-wrap">
        <Head eyebrow={FLEET.eyebrow} title={FLEET.title} lede={FLEET.lede} />
        <div className="qf-fleet">
          {FLEET.items.map((it) => (
            <article key={it.name}>
              <h3>{it.name}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 10 · Architecture ────────────────────────────────────────────── */
export function Architecture() {
  return (
    <section className="qf-sec qf-tint" id="architecture">
      <div className="qf-wrap">
        <Head
          eyebrow={ARCHITECTURE.eyebrow}
          title={ARCHITECTURE.title}
          lede={ARCHITECTURE.lede}
        />
        <div className="qf-arch">
          {/* A real stack, drawn as a stack. The middle layer is the product;
              the two it sits between are deliberately muted, because the
              claim is that we do not compete with either of them. */}
          <div className="qf-stack" aria-label="Where QuantumFlies sits in the control path">
            {ARCHITECTURE.layers.map((l) => (
              <div
                key={l.name}
                className={`qf-layer${l.accent ? " qf-layer-on" : ""}${l.muted ? " qf-layer-off" : ""}`}
              >
                <strong>{l.name}</strong>
                <span>{l.body}</span>
              </div>
            ))}
          </div>
          <dl className="qf-rows">
            {ARCHITECTURE.points.map((p) => (
              <div key={p.k}>
                <dt>{p.k}</dt>
                <dd>{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ── 11 · Why ─────────────────────────────────────────────────────── */
export function Why() {
  return (
    <section className="qf-sec" id="why">
      <div className="qf-wrap qf-split">
        <div className="qf-sticky">
          <Head eyebrow={WHY.eyebrow} title={WHY.title} lede={WHY.lede} />
        </div>
        <div className="qf-why-list">
          {WHY.items.map((it) => (
            <article key={it.title}>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 12 · CTA ─────────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="qf-sec qf-inv qf-final" id="cta">
      <div className="qf-wrap">
        <h2 className="qf-h2 qf-final-h">{CTA.title}</h2>
        <p className="qf-section-lede">{CTA.lede}</p>
        <div className="qf-cta">
          <a className="qf-btn qf-btn-lime" href="/early-access">{CTA.primary}</a>
          <a className="qf-btn qf-btn-ondark" href="/architecture">{CTA.secondary}</a>
        </div>
      </div>
    </section>
  );
}
