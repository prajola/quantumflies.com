/**
 * Nav, footer, and the two behaviours a client-side router has to add back:
 * scrolling to the top on navigation, and honouring an #anchor when one is
 * present. A browser does both for free on a full page load; a router does
 * neither unless it is told to.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { CTA_LABEL, FOOTER, NAV } from "@/content";
import Logo from "@/components/Logo";

/** Marks the nav item for the section of the site you are actually in. */
function isCurrent(here: string, href: string) {
  if (href === "/") return here === "/";
  return here === href || here.startsWith(href + "/");
}

export function ScrollManager() {
  const [loc] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Let the new route paint before looking for the target.
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [loc]);
  return null;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();

  // A route change must close the menu, or the sheet stays open over the page
  // you just navigated to.
  useEffect(() => setOpen(false), [loc]);

  return (
    <header className="qf-nav">
      <Link href="/" className="qf-brand">
        <Logo className="qf-mark" />
        QuantumFlies
      </Link>

      <nav className={`qf-nav-links${open ? " is-open" : ""}`} aria-label="Primary">
        {NAV.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            aria-current={isCurrent(loc, n.href) ? "page" : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="qf-nav-right">
        <Link href="/early-access" className="qf-btn qf-btn-solid">{CTA_LABEL}</Link>
        <button
          type="button"
          className="qf-burger"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="qf-foot">
      <div className="qf-foot-rule" aria-hidden="true" />

      <div className="qf-wrap qf-foot-grid">
        <div className="qf-foot-brand">
          <Link href="/" className="qf-brand">
            <Logo className="qf-mark" />
            QuantumFlies
          </Link>
          <p>{FOOTER.tagline}</p>
        </div>

        {FOOTER.columns.map((col) => (
          // Each column is its own <nav> with an accessible name, so a screen
          // reader can jump between them instead of walking one 32-item list.
          <nav key={col.title} className="qf-foot-col" aria-label={col.title}>
            <h2>{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("http") ? (
                    <a href={l.href} target="_blank" rel="noreferrer noopener">{l.label}</a>
                  ) : (
                    <Link href={l.href}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="qf-wrap qf-foot-bottom">
        {/* Computed, not written: a hardcoded footer year is wrong on
            1 January and nobody notices until March. */}
        <p>© {new Date().getFullYear()} {FOOTER.company}</p>
        <ul>
          {FOOTER.legal.map((l) => (
            <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
