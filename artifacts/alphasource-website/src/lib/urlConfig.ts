type QueryValue = string | number | boolean | null | undefined;
type QueryInput = string | URLSearchParams | Record<string, QueryValue>;

function trimTrailingSlashes(value: string): string {
  return value.trim().replace(/\/+$/, "");
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
  const origin =
    (typeof base === "string" && base.trim()
      ? trimTrailingSlashes(base)
      : "") ||
    (typeof window !== "undefined" && window.location
      ? trimTrailingSlashes(window.location.origin)
      : "");

  const pwResetBase = origin ? `${origin}/pwreset` : "/pwreset";
  return appendQuery(pwResetBase, query);
}
