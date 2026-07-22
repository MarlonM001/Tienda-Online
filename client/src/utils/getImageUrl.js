export function getImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${import.meta.env.VITE_API_ORIGIN}${path}`;
}
