export function assetPath(path: string): string {
  if (!path) {
    return path;
  }

  if (
    /^(?:https?:)?\/\//i.test(path) ||
    /^data:/i.test(path) ||
    /^blob:/i.test(path)
  ) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  if (path.startsWith(baseUrl)) {
    return path;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
