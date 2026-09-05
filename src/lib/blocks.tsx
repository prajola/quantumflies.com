/**
 * Block renderer.
 *
 * There are two dozen sub-pages. Hand-writing two dozen components would mean
 * two dozen slightly different ideas of what a spec table looks like within a
 * month, so a page is DATA — a hero plus an ordered list of blocks — and this
 * file is the only place that knows how a block is drawn.
 *
 * Adding a page is adding an entry to pagedata.ts. Restyling every page is
 * editing one block here.
 *
 * ── ON HONESTY ───────────────────────────────────────────────────────────
 * `Row.unverified` renders a visible `est.` marker, the same one the homepage
 * uses. Any figure on any page that is a target rather than a measurement
 * carries it, so nothing hardens into a claim by being repeated. A safety
 * company inventing a latency number it has not measured is the specific
 * failure this guards against.
 */

import { Link } from "wouter";

export type Row = { k: string; v: string; unverified?: boolean };
export type Card = { name: string; body: string; href?: string };

export type Block =
  | { kind: "points"; title?: string; lede?: string; items: string[] }
  | { kind: "specs"; title?: string; lede?: string; rows: Row[] }
  | { kind: "cards"; title?: string; lede?: string; items: Card[] }
  | { kind: "steps"; title?: string; lede?: string; items: { tag: string; body: string }[] }
  | { kind: "prose"; title?: string; paras: string[] }
  | { kind: "code"; title?: string; lede?: string; lang?: string; code: string }
  | { kind: "table"; title?: string; lede?: string; cols: string[]; rows: string[][] }
  | { kind: "note"; body: string };

function Title({ title, lede }: { title?: string; lede?: string }) {
  if (!title && !lede) return null;
  return (
    <header className="qf-blk-head">
      {title && <h2 className="qf-h2">{title}</h2>}
      {lede && <p className="qf-section-lede">{lede}</p>}
    </header>
  );
}

function One({ b }: { b: Block }) {
  switch (b.kind) {
    case "points":
      return (
        <>
          <Title title={b.title} lede={b.lede} />
          <ul className="qf-ticks">
            {b.items.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </>
      );

    case "specs":
      return (
        <>
          <Title title={b.title} lede={b.lede} />
          <dl className="qf-rows">
            {b.rows.map((r) => (
              <div key={r.k}>
                <dt>{r.k}</dt>
                <dd>
                  {r.v}
                  {r.unverified && <i className="qf-est" title="Target, not a measured figure">est.</i>}
                </dd>
              </div>
            ))}
          </dl>
        </>
      );

    case "cards":
      return (
        <>
          <Title title={b.title} lede={b.lede} />
          <div className="qf-cases">
            {b.items.map((c) =>
              // A card that navigates is a link; a card that does not is an
              // article. Never a div with an onClick.
              c.href ? (
                <Link key={c.name} href={c.href} className="qf-case qf-case-link">
                  <h3>{c.name}</h3>
                  <p>{c.body}</p>
                  <span className="qf-case-go" aria-hidden="true">→</span>
                </Link>
              ) : (
                <article key={c.name} className="qf-case">
                  <h3>{c.name}</h3>
                  <p>{c.body}</p>
                </article>
              ),
            )}
          </div>
        </>
      );

    case "steps":
      return (
        <>
          <Title title={b.title} lede={b.lede} />
          <ol className="qf-steps qf-steps-tight">
            {b.items.map((s, i) => (
              <li key={s.tag} className="qf-step">
                <span className="qf-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="qf-step-tag">{s.tag}</span>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </>
      );

    case "prose":
      return (
        <div className="qf-prose">
          {b.title && <h2 className="qf-prose-h">{b.title}</h2>}
          {b.paras.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
        </div>
      );

    case "code":
      return (
        <>
          <Title title={b.title} lede={b.lede} />
          {/* tabIndex makes the block keyboard-scrollable — a <pre> that
              overflows is unreachable without a pointer otherwise. */}
          <pre className="qf-code" tabIndex={0}>
            <code>{b.code}</code>
          </pre>
        </>
      );

    case "table":
      return (
        <>
          <Title title={b.title} lede={b.lede} />
          {/* The wrapper scrolls, and the table carries a min-width so it has
              something to scroll — a 100%-width table inside an overflow box
              crushes its columns instead. */}
          <div className="qf-table-wrap">
            <table className="qf-table">
              <thead>
                <tr>{b.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r.join("|")}>
                    {r.map((cell, i) =>
                      i === 0
                        ? <th key={i} scope="row">{cell}</th>
                        : <td key={i}>{cell}</td>,
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );

    case "note":
      return <p className="qf-note">{b.body}</p>;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <section
          key={i}
          className={`qf-sec qf-blk${i % 2 === 1 ? " qf-tint" : ""}`}
        >
          <div className="qf-wrap">
            <One b={b} />
          </div>
        </section>
      ))}
    </>
  );
}
