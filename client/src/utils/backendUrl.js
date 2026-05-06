const envBackendUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const BACKEND_URL = envBackendUrl;

export function buildBackendUrl(path = '') {
  if (!path) return BACKEND_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (!BACKEND_URL) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
}
