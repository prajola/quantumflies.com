/**
 * 404.
 *
 * Deliberately not a redirect to the homepage: silently landing someone on
 * the front page tells them nothing and hides broken links from whoever
 * needs to fix them.
 */

import { useEffect } from "react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    document.title = "Not found — QuantumFlies";
  }, []);

  return (
    <section className="qf-page-hero qf-404">
      <div className="qf-wrap">
        <p className="qf-eyebrow-plain">404</p>
        <h1 className="qf-page-h1">That page does not exist.</h1>
        <p className="qf-page-lede">
          The link may be out of date, or the page may not have been written yet.
        </p>
        <div className="qf-cta">
          <Link href="/" className="qf-btn qf-btn-solid">Back to the homepage</Link>
          <Link href="/platform" className="qf-btn qf-btn-ghost">See the platform</Link>
        </div>
      </div>
    </section>
  );
}
