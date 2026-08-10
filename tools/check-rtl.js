#!/usr/bin/env node
/**
 * Assert that the RTL flip reached the library, and did not invert the islands.
 *
 * Two failures are possible here and neither shows up as a build error:
 *
 *   1. **The flip is not running at all.** ng-packagr only reads
 *      `postcss.config.json` / `.postcssrc.json` from the primary entry point's
 *      directory — no `.js` form, no upward search. Put the file one level off
 *      and the build succeeds, ships unflipped CSS, and says nothing. This is
 *      the library-build version of the trap the application hit, where the
 *      plugin attached to zero postcss-loader instances.
 *
 *   2. **The islands came back inverted.** `direction` is a directional
 *      declaration, so the plugin rewrites `.ltr-canvas { direction: ltr }`
 *      into `[dir=rtl] .ltr-canvas { direction: rtl }` unless a
 *      `/*! rtl:ignore *\/` directive stops it — and the directive has to be the
 *      loud form, or Sass drops it when compressed and the bug exists only in
 *      production.
 *
 * Run after `ng build dui`.
 *
 *   node tools/check-rtl.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'dui');

function fail(message) {
  console.error(`FAIL  ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(DIST)) {
  fail(`no build output at ${path.relative(ROOT, DIST)} — run "ng build dui" first`);
  return;
}

// --- 1. the flip reached compiled component styles ---------------------------

function* bundles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* bundles(full);
    else if (entry.name.endsWith('.mjs')) yield full;
  }
}

let withStyles = 0;
let withFlip = 0;
for (const file of bundles(DIST)) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes('styles: [')) continue;
  withStyles += 1;
  if (/\[dir=\\?["']?rtl/.test(text)) withFlip += 1;
}

if (withStyles === 0) {
  fail('no compiled component styles found in the build output at all');
} else if (withFlip === 0) {
  fail(`${withStyles} bundles carry component styles and none contains a [dir=rtl] rule.\n` +
       '        postcss-rtlcss did not run. Check that src/postcss.config.json sits\n' +
       '        beside src/ng-package.json — ng-packagr does not search upwards.');
} else {
  console.log(`ok    ${withFlip}/${withStyles} style-bearing bundles carry [dir=rtl] rules`);
}

// --- 2. the islands survived -------------------------------------------------

const themePath = path.join(DIST, 'theming', '_rtl.scss');
if (!fs.existsSync(themePath)) {
  fail('theming/_rtl.scss is missing from the package — consumers cannot get the contract');
} else {
  const source = fs.readFileSync(themePath, 'utf8');
  const guarded = (source.match(/\/\*!\s*rtl:ignore\s*\*\//g) || []).length;
  const directions = (source.match(/^\s*direction\s*:/gm) || []).length;
  if (guarded < directions) {
    fail(`${directions} direction declarations but only ${guarded} loud rtl:ignore ` +
         'directives — an unguarded one will be inverted in RTL');
  } else {
    console.log(`ok    all ${directions} direction declarations carry a loud rtl:ignore`);
  }
}
