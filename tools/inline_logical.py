#!/usr/bin/env python3
"""Rewrite direction-sensitive declarations in inline `style` attributes to
their logical equivalents.

PostCSS never sees a `style` attribute, so these are the one part of the layout
the build-time flip cannot reach. Logical properties resolve against the
*element's* own direction, which composes correctly with the LTR islands: a
`inset-inline-start` inside a `.ltr-canvas` still means left, because the island
sets `direction: ltr`.

Only literal values are touched. A declaration carrying a binding or a `calc()`
is reported rather than rewritten, because its intent is not always positional.

  ./inline_logical.py --dry-run
  ./inline_logical.py
"""

import argparse
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_ROOT = os.path.dirname(HERE)
ROOT = DEFAULT_ROOT
# Repos here use several layouts: src/ (dui, bpos, ucos, searchos),
# libs/<name>/src (xdraw, bimos, Nx style) and lib/ (duix).
SEARCH = ["src", "projects", "libs", "lib"]
SKIP_DIRS = {"node_modules", "dist", ".git", "tmp"}

# Bounded by .browserslistrc, now Chrome >= 118. Every logical property in play
# landed well before that (`float: inline-start` at 118 is the latest), so the
# whole set is available:
#
#   margin/padding/border-inline-*   Chrome 69
#   text-align: start | end          ancient
#   inset-inline-*                   Chrome 87
#   float: inline-start | inline-end Chrome 118
PROPERTY_MAP = {
    "margin-left": "margin-inline-start",
    "margin-right": "margin-inline-end",
    "padding-left": "padding-inline-start",
    "padding-right": "padding-inline-end",
    "border-left": "border-inline-start",
    "border-right": "border-inline-end",
    "left": "inset-inline-start",
    "right": "inset-inline-end",
}
# `text-align` and `float` change their *value*, not their property name.
VALUE_MAP = {
    "text-align": {"left": "start", "right": "end"},
    "float": {"left": "inline-start", "right": "inline-end"},
}

STYLE_ATTR = re.compile(r"""(\bstyle\s*=\s*)(["'])(.*?)\2""", re.S)
DECLARATION = re.compile(r"(^|;)(\s*)([a-zA-Z-]+)(\s*:\s*)([^;]*)")


def convert(style_body, stats, deferred, where):
    def repl(m):
        head, space, prop, colon, value = m.groups()
        key = prop.strip().lower()
        raw = value.strip()
        if key not in PROPERTY_MAP and key not in VALUE_MAP:
            return m.group(0)
        # A binding decides the value at runtime; the author may be positioning
        # against a canvas rather than a text flow, so leave it to a human.
        if "{{" in raw or "calc(" in raw:
            deferred.append((where, key, raw[:40]))
            return m.group(0)
        if key in VALUE_MAP:
            mapped = VALUE_MAP[key].get(raw.lower())
            if not mapped:
                return m.group(0)
            stats[f"{key}: {raw.lower()}"] += 1
            return f"{head}{space}{prop}{colon}{mapped}"
        stats[key] += 1
        return f"{head}{space}{PROPERTY_MAP[key]}{colon}{value}"

    return DECLARATION.sub(repl, style_body)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--root", default=DEFAULT_ROOT,
                    help="repository to operate on (defaults to this one)")
    args = ap.parse_args()

    global ROOT
    ROOT = os.path.abspath(args.root)

    present = [d for d in SEARCH if os.path.isdir(os.path.join(ROOT, d))]
    if not present:
        raise SystemExit(
            f"none of {SEARCH} exist under {ROOT} -- wrong --root, or a source "
            f"layout this tool does not know about")

    stats, deferred = Counter(), []
    changed_files = 0

    for base in SEARCH:
        for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, base)):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for fn in filenames:
                if not fn.endswith(".html"):
                    continue
                path = os.path.join(dirpath, fn)
                with open(path, encoding="utf-8", newline="") as fh:
                    text = fh.read()
                if "style" not in text:
                    continue
                rel = os.path.relpath(path, ROOT)

                def attr_repl(m):
                    prefix, quote, body = m.groups()
                    return prefix + quote + convert(body, stats, deferred, rel) + quote

                new_text = STYLE_ATTR.sub(attr_repl, text)
                if new_text == text:
                    continue
                changed_files += 1
                if args.dry_run:
                    print(f"  {rel}")
                else:
                    with open(path, "w", encoding="utf-8", newline="") as fh:
                        fh.write(new_text)

    total = sum(stats.values())
    verb = "would rewrite" if args.dry_run else "rewrote"
    print(f"\n{verb} {total} declarations in {changed_files} templates")
    for key, n in stats.most_common():
        print(f"  {n:>4}  {key}")
    if deferred:
        print(f"\n{len(deferred)} left for a human (binding or calc):", file=sys.stderr)
        for where, key, raw in deferred[:10]:
            print(f"  {where}\n    {key}: {raw}", file=sys.stderr)


if __name__ == "__main__":
    main()
