export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export function getSafeImage(src: string | null | undefined, fallback: string): string {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return fallback;
  }
  return src.trim();
}

export function isValidImageUrl(src: string | null | undefined): boolean {
  if (!src || typeof src !== 'string' || src.trim() === '') return false;
  const s = src.trim().toLowerCase();
  return s.startsWith('http') || s.startsWith('/') || s.startsWith('data:');
}
