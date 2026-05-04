import { useEffect } from "react";

type TawkVariant = "public" | "dashboard";

interface TawkWidgetProps {
  enabled: boolean;
  propertyId?: string;
  widgetId?: string;
  variant: TawkVariant;
}

interface TawkApi {
  shutdown?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

const TAWK_SCRIPT_ID = "alphasource-tawk-script";

function shutdownTawk() {
  if (typeof window === "undefined") return;
  if (typeof window.Tawk_API?.shutdown !== "function") return;
  try {
    window.Tawk_API.shutdown();
  } catch {
    // no-op
  }
}

function resetTawkGlobals() {
  if (typeof window === "undefined") return;
  delete window.Tawk_API;
  delete window.Tawk_LoadStart;
}

function removeOwnedScript() {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(TAWK_SCRIPT_ID);
  if (existing?.parentNode) {
    existing.parentNode.removeChild(existing);
  }
}

function cleanupOwnedTawk() {
  shutdownTawk();
  removeOwnedScript();
  resetTawkGlobals();
}

export default function TawkWidget({
  enabled,
  propertyId,
  widgetId,
  variant,
}: TawkWidgetProps) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const normalizedPropertyId = String(propertyId || "").trim();
    const normalizedWidgetId = String(widgetId || "").trim();
    if (!enabled || !normalizedPropertyId || !normalizedWidgetId) return;

    const src = `https://embed.tawk.to/${normalizedPropertyId}/${normalizedWidgetId}`;
    const existing = document.getElementById(TAWK_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      if (existing.src === src) {
        return cleanupOwnedTawk;
      }
      cleanupOwnedTawk();
    }

    window.Tawk_API = {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = TAWK_SCRIPT_ID;
    script.async = true;
    script.src = src;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.setAttribute("data-tawk-variant", variant);
    document.head.appendChild(script);

    return cleanupOwnedTawk;
  }, [enabled, propertyId, widgetId, variant]);

  return null;
}
