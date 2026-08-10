#!/usr/bin/env python3
"""Add Material's `mat-icon-rtl-mirror` class to directional `<mat-icon>` tags.

Only icons that mean a direction are flipped. An icon depicting an object -- a
pencil, a folder, a magnifier -- keeps its orientation in RTL, so this works
from an explicit list rather than flipping everything with an arrow in its name.

Icons whose name is an expression (`{{ open ? 'expand_more' : 'chevron_right' }}`)
cannot be decided statically and are reported for a human to look at.

  ./mark_rtl_icons.py --dry-run
  ./mark_rtl_icons.py
"""

import argparse
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_ROOT = os.path.dirname(HERE)
ROOT = DEFAULT_ROOT              # repo root
# Repos here use several layouts: src/ (dui, bpos, ucos, searchos),
# libs/<name>/src (xdraw, bimos, Nx style) and lib/ (duix).
SEARCH = ["src", "projects", "libs", "lib"]
SKIP_DIRS = {"node_modules", "dist", ".git", "tmp"}
MIRROR_CLASS = "mat-icon-rtl-mirror"

# Ligatures whose glyph points somewhere. `expand_more` / `expand_less` are
# vertical and deliberately absent.
DIRECTIONAL = {
    "chevron_left", "chevron_right",
    "arrow_back", "arrow_forward",
    "arrow_back_ios", "arrow_forward_ios",
    "arrow_left", "arrow_right",
    "arrow_circle_left", "arrow_circle_right",
    "keyboard_arrow_left", "keyboard_arrow_right",
    "keyboard_double_arrow_left", "keyboard_double_arrow_right",
    "keyboard_tab", "first_page", "last_page",
    "navigate_before", "navigate_next",
    "subdirectory_arrow_left", "subdirectory_arrow_right",
    "trending_flat", "reply", "reply_all", "forward",
    "format_indent_increase", "format_indent_decrease",
    "send", "double_arrow", "east", "west",
}

# <mat-icon ...>name</mat-icon> on one line, attributes optional.
ICON = re.compile(r"<mat-icon\b([^>]*)>\s*([^<>{}\s][^<>{}]*?)\s*</mat-icon>")
DYNAMIC = re.compile(r"<mat-icon\b[^>]*>\s*\{\{.*?\}\}\s*</mat-icon>", re.S)
CLASS_ATTR = re.compile(r'\bclass\s*=\s*(["\'])(.*?)\1')


def add_class(attrs):
    """Return `attrs` with the mirror class merged into any existing class."""
    match = CLASS_ATTR.search(attrs)
    if not match:
        return f' class="{MIRROR_CLASS}"' + attrs
    quote, value = match.group(1), match.group(2)
    if MIRROR_CLASS in value.split():
        return attrs
    merged = f"{value} {MIRROR_CLASS}".strip()
    return attrs[:match.start()] + f"class={quote}{merged}{quote}" + attrs[match.end():]


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

    changed = marked = 0
    dynamic_sites = []

    for base in SEARCH:
        for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, base)):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for fn in filenames:
                if not fn.endswith(".html"):
                    continue
                path = os.path.join(dirpath, fn)
                with open(path, encoding="utf-8", newline="") as fh:
                    text = fh.read()
                if "<mat-icon" not in text:
                    continue
                rel = os.path.relpath(path, ROOT)

                for m in DYNAMIC.finditer(text):
                    snippet = m.group(0).replace("\n", " ")
                    if any(name in snippet for name in DIRECTIONAL):
                        dynamic_sites.append((rel, snippet[:100]))

                hits = []

                def repl(m):
                    attrs, name = m.group(1), m.group(2).strip()
                    if name not in DIRECTIONAL:
                        return m.group(0)
                    new_attrs = add_class(attrs)
                    if new_attrs == attrs:
                        return m.group(0)
                    hits.append(name)
                    return f"<mat-icon{new_attrs}>{m.group(2)}</mat-icon>"

                new_text = ICON.sub(repl, text)
                if not hits:
                    continue
                marked += len(hits)
                changed += 1
                if args.dry_run:
                    print(f"{rel}: {', '.join(sorted(set(hits)))}")
                else:
                    with open(path, "w", encoding="utf-8", newline="") as fh:
                        fh.write(new_text)

    verb = "would mark" if args.dry_run else "marked"
    print(f"\n{verb} {marked} directional icons in {changed} files")
    if dynamic_sites:
        print(f"\n{len(dynamic_sites)} icons pick their name at runtime and need a "
              f"human decision:", file=sys.stderr)
        for rel, snippet in dynamic_sites[:15]:
            print(f"  {rel}\n    {snippet}", file=sys.stderr)


if __name__ == "__main__":
    main()
