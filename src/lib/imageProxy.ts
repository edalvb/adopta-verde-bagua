// Helper para convertir URLs remotas http/https en rutas del proxy interno
export function toProxied(src: string | null | undefined): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) {
    return `/api/image?url=${encodeURIComponent(src)}`;
  }
  return src;
}
