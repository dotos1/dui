/**
 * Prefers the Chinese JSDoc translation (`@zh` tag) over the English source comment.
 * The site is Chinese-first for now; a future locale switcher can flip this default.
 */
export function preferZh(zh: string | null | undefined, en: string | null | undefined): string | null {
  return zh || en || null;
}
