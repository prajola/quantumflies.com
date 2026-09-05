import { build } from "esbuild";
import fs from "node:fs";

// Evaluate the real module rather than regexing its source — template-literal
// paths are invisible to a text scan, which is what made the last check lie.
const out = await build({
  entryPoints: ["src/pagedata.ts"],
  bundle: true, write: false, format: "esm", platform: "node",
  external: ["react", "react-dom", "wouter"],
  alias: { "@": new URL("./src", import.meta.url).pathname },
  loader: { ".tsx": "tsx" },
});
const mod = await import(
  "data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64")
);

const routes = new Set(["/", ...mod.PAGES.map(p => p.path)]);

const files = ["src/content.ts","src/pagedata.ts","src/pages/Page.tsx",
               "src/pages/NotFound.tsx","src/components/Layout.tsx","src/pages/Home.tsx"];
const links = new Set();
for (const f of files)
  for (const m of fs.readFileSync(f,"utf8").matchAll(/href[=:] ?["{]?"([^"]+)"/g))
    links.add(m[1]);

const internal = [...links].filter(h => h.startsWith("/") && !h.startsWith("/#"));
const broken   = internal.filter(h => !routes.has(h));
const orphans  = [...routes].filter(r => r !== "/" && !internal.includes(r));

console.log("routes registered :", routes.size);
console.log("internal links    :", internal.length);
console.log("BROKEN            :", broken.length, broken.join(" ") || "— none");
console.log("ORPHAN ROUTES     :", orphans.length, orphans.join(" ") || "— none");
console.log("\nAll routes:");
[...routes].sort().forEach(r => console.log("  ", r));
