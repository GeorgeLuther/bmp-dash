// Only allow same-origin, path-only redirects like "/personnel/active"
export function safeRedirect(input: string | null | undefined, fallback = "/"): string {
  if (!input) return fallback;
  if (!input.startsWith("/") || input.startsWith("//")) return fallback; // disallow protocol/host/2-slash
  return input; // allow path + query + hash
}
