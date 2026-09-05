/**
 * Homepage.
 *
 * Flow, in the order it was specified:
 *   Hero → Problem → How It Works → QuantumClaw → Action Gate → Solutions
 *   → Simulation → QuantumClue → Fleet → Architecture → Why → CTA
 *
 * The hero composition follows a reference motion study — nav across the top,
 * claim ranged left, a 3D object on the right, metrics beneath it, one
 * floating product card. What is NOT from it: the copy, palette, mark and
 * product. What was reusable is the STRUCTURE — where a 3D object can sit so
 * it frames a column of text rather than fighting it.
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "wouter";
import { HERO } from "@/content";
import {
  Problem, HowItWorks, Claw, ActionGate, Solutions,
  Simulation, Clue, Fleet, Architecture, Why, FinalCta,
} from "@/sections";

/**
 * three.js is ~880KB and the instrument is decoration — the hero states
 * everything it needs to in text. Loading it lazily means the headline and CTA
 * paint on the main chunk and the scene streams in behind them.
 */
const TrustRing = lazy(() => import("@/scene/TrustRing"));

/**
 * Whether the 3D instrument is worth its download here.
 *
 * three.js is ~883KB (240KB gzipped) and the ring is decoration — the hero
 * says everything it needs to in text. Sending that to a phone on cellular so
 * it can render a 260px ornament is the wrong trade, so below 640px the
 * import never fires and the chunk is never fetched. Tablets and desktops
 * still get it.
 *
 * Matched with matchMedia rather than a CSS `display: none`, because hiding
 * the canvas would still have downloaded and executed all of it.
 */
function useWantsScene() {
  const q = "(min-width: 640px)";
  const [want, setWant] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setWant(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return want;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Hero({ reduced, scene }: { reduced: boolean; scene: boolean }) {
  return (
    <section className="qf-hero">
      {/* Decorative: every claim here is also stated in text. */}
      <div className="qf-drift" aria-hidden="true">
        {HERO.drift.map((w, i) => (
          <span key={w} style={{ "--i": i } as React.CSSProperties}>{w}</span>
        ))}
      </div>

      <div className="qf-copy">
        <p className="qf-eyebrow">
          <span className="qf-dot" aria-hidden="true" />
          {HERO.eyebrow}
        </p>

        <h1 className="qf-h1">
          {HERO.titleLead} <em>{HERO.titleAccent}</em> {HERO.titleRest}
        </h1>

        <p className="qf-lede">{HERO.lede}</p>

        <div className="qf-cta">
          <Link href="/early-access" className="qf-btn qf-btn-solid">{HERO.primary}</Link>
          <Link href="/architecture" className="qf-btn qf-btn-ghost">{HERO.secondary}</Link>
        </div>

        <article className="qf-card">
          <h2>{HERO.cardTitle}</h2>
          <p>{HERO.cardBody}</p>
          <ul>
            {HERO.cardTags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </article>
      </div>

      {/* The instrument and the numbers it produces, as one column. Keeping
          them together is what lets the ring be small: it is not holding the
          right side of the page up on its own. */}
      <div className="qf-side">
        {/* No fallback: an empty stage is the right intermediate state for a
            decorative layer. A spinner would draw the eye to the one thing on
            the page that does not matter. */}
        {scene && (
          <div className="qf-stage" aria-hidden="true">
            <Suspense fallback={null}>
              <TrustRing reduced={reduced} />
            </Suspense>
          </div>
        )}

        <dl className="qf-metrics">
          {HERO.metrics.map((m) => (
            <div key={m.label}>
              <dt>
                {m.value}
                {m.unverified && <i className="qf-est" title="Target, not a measured figure">est.</i>}
              </dt>
              <dd>{m.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function Home() {
  const reduced = useReducedMotion();
  const scene = useWantsScene();

  useEffect(() => {
    document.title =
      "QuantumFlies — the independent trust and runtime decision layer for autonomous machines";
  }, []);

  return (
    <>
      <Hero reduced={reduced} scene={scene} />
      <Problem />
      <HowItWorks />
      <Claw />
      <ActionGate />
      <Solutions />
      <Simulation />
      <Clue />
      <Fleet />
      <Architecture />
      <Why />
      <FinalCta />
    </>
  );
}
