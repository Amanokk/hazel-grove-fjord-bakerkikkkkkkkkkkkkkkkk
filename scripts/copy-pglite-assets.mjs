#!/usr/bin/env node
/**
 * Nitro bundles `@electric-sql/pglite` into `_libs/electric-sql__pglite.mjs`
 * but does not emit the sibling WASM/data files Emscripten loads at runtime.
 * On Vercel that becomes:
 *   ENOENT: open '/var/task/_libs/pglite.data'
 *
 * Copy those assets next to every bundled PGlite chunk (and into each `_libs`
 * directory) after `vite build`.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const pgliteDist = dirname(require.resolve("@electric-sql/pglite"));

const ASSET_NAMES = ["pglite.data", "pglite.wasm", "initdb.wasm"];

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function copyInto(dir) {
  mkdirSync(dir, { recursive: true });
  let copied = 0;
  for (const name of ASSET_NAMES) {
    const src = join(pgliteDist, name);
    if (!existsSync(src)) continue;
    const dest = join(dir, name);
    copyFileSync(src, dest);
    copied += 1;
  }
  return copied;
}

const searchRoots = [
  join(root, ".vercel", "output"),
  join(root, ".output"),
  join(root, ".nitro"),
];

const targets = new Set();
for (const base of searchRoots) {
  for (const file of walk(base)) {
    const name = file.replace(/\\/g, "/");
    if (
      name.endsWith("/electric-sql__pglite.mjs") ||
      name.endsWith("/electric-sql__pglite.js")
    ) {
      targets.add(dirname(file));
    }
    if (name.includes("/_libs/") || name.endsWith("/_libs")) {
      const idx = name.lastIndexOf("/_libs");
      const libsDir = file.slice(0, idx + "/_libs".length);
      if (existsSync(libsDir) && statSync(libsDir).isDirectory()) {
        targets.add(libsDir);
      }
    }
  }
}

if (targets.size === 0) {
  console.log(
    "[pglite-assets] no Nitro/_libs output found — skipping (dev server uses node_modules).",
  );
  process.exit(0);
}

for (const dir of targets) {
  const n = copyInto(dir);
  console.log(`[pglite-assets] copied ${n} file(s) -> ${dir}`);
}
