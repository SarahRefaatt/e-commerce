// lib/utils.ts
export function cn(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
