
export function applyCssTransform(element: HTMLElement, transformValue: string) {
  const value = transformValue.trim();

  element.style.transform = value;
  element.style.webkitTransform = value;
}
