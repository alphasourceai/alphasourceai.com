type QueryValue = string | number | boolean | null | undefined;
type QueryInput = string | URLSearchParams | Record<string, QueryValue>;

const env =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

function trimTrailingSlashes(value: unknown): string {
  return String(value || "").trim().replace(/\/+$/, "");
}

function firstBase(...values: unknown[]): string {
  for (const value of values) {
    const normalized = trimTrailingSlashes(value);
    if (normalized) return normalized;
  }
  return "";
}

const canonicalFrontendBase = firstBase(
  (env as Record<string, unknown>).VITE_CLIENT_APP_BASE,
  (env as Record<string, unknown>).VITE_PUBLIC_SITE_BASE,
  (env as Record<string, unknown>).VITE_FRONTEND_BASE,
  (env as Record<string, unknown>).VITE_FRONTEND_URL,
  (env as Record<string, unknown>).VITE_APP_BASE_URL,
  (env as Record<string, unknown>).VITE_SITE_URL,
);

function resolveWindowOrigin(): string {
  if (typeof window === "undefined" || !window.location) return "";
  return trimTrailingSlashes(window.location.origin);
}

function serializeQuery(query?: QueryInput): string {
  if (!query) return "";
  if (query instanceof URLSearchParams) return query.toString();
  if (typeof query === "string") return query.replace(/^\?+/, "");

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.set(key, String(value));
  }
  return params.toString();
}

function appendQuery(url: string, query?: QueryInput): string {
  const serialized = serializeQuery(query);
  return serialized ? `${url}?${serialized}` : url;
}

export function buildPwResetUrl(
  query?: QueryInput,
  { base }: { base?: string } = {},
): string {
  const origin = firstBase(
    typeof base === "string" ? base : "",
    canonicalFrontendBase,
    resolveWindowOrigin(),
  );

  const pwResetBase = origin ? `${origin}/pwreset` : "/pwreset";
  return appendQuery(pwResetBase, query);
}
