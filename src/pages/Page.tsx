/**
 * The shell every sub-page renders into.
 *
 * One component, driven by a PageDef. Twenty-four hand-written pages would be
 * twenty-four slightly different ideas of what a page header looks like inside
 * a month; this way there is one, and content lives in pagedata.ts.
 */

import { useEffect } from "react";
import { Link } from "wouter";
import { Blocks } from "@/lib/blocks";
import type { PageDef } from "@/pagedata";

const SUFFIX = "QuantumFlies";

export default function Page({ def }: { def: PageDef }) {
  useEffect(() => {
    document.title = `${def.title} — ${SUFFIX}`;
  }, [def.title]);

  return (
    <>
      <header className="qf-page-hero">
        <div className="qf-wrap">
          <p className="qf-eyebrow-plain">{def.eyebrow}</p>
          <h1 className="qf-page-h1">{def.heading}</h1>
          <p className="qf-page-lede">{def.lede}</p>
        </div>
      </header>

      <Blocks blocks={def.blocks} />

      {/* Every page ends somewhere rather than trailing off. The closing band
          is the same one the homepage uses, so the site has one exit. */}
      <section className="qf-sec qf-inv qf-final">
        <div className="qf-wrap">
          <h2 className="qf-h2 qf-final-h">
            Machines are already moving. Decide who signs for them.
          </h2>
          <div className="qf-cta">
            <Link href="/early-access" className="qf-btn qf-btn-lime">Get early access</Link>
            <Link href="/architecture" className="qf-btn qf-btn-ondark">Read the architecture</Link>
          </div>
        </div>
      </section>
    </>
  );
}
