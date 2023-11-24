export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window !== "undefined" && window.IntersectionObserver) {
    return new IntersectionObserver(callback, options);
  }

  return null;
}
