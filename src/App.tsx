/**
 * Router.
 *
 * Every sub-page is the same component (pages/Page) fed a different record
 * from pagedata.ts, so routes are generated from the page registry rather
 * than written out one <Route> at a time. A page that exists in the data has
 * a route by construction, which is what stops the footer linking into
 * nothing — the failure this replaced.
 *
 * wouter rather than react-router: ~2KB, and the same router the team's other
 * marketing site uses.
 */

import { Route, Switch } from "wouter";
import { Nav, ScrollManager, SiteFooter } from "@/components/Layout";
import { PAGES } from "@/pagedata";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Page from "@/pages/Page";
import "@/styles.css";

export default function App() {
  return (
    <div className="qf">
      <a className="qf-skip" href="#main">Skip to content</a>
      <ScrollManager />
      <Nav />
      <main id="main">
        <Switch>
          <Route path="/" component={Home} />
          {PAGES.map((def) => (
            <Route key={def.path} path={def.path}>
              <Page def={def} />
            </Route>
          ))}
          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
    </div>
  );
}
