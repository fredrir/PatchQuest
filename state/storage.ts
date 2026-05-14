"use client";

/**
 * Tiny typed wrapper around `localStorage`. Lives in its own file so the rest
 * of the state layer never has to think about JSON, SSR, or quota errors.
 */

const NAMESPACE = "sct/v1";

function key(name: string): string {
  return `${NAMESPACE}/${name}`;
}

export function readJson<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function notify(name: string): void {
  // Defer to a microtask so cross-component subscribers don't `setState`
  // during the writer's render/commit phase (which React 19 warns about).
  queueMicrotask(() => {
    window.dispatchEvent(
      new CustomEvent("sct:storage", { detail: { key: name } }),
    );
  });
}

export function writeJson<T>(name: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
    notify(name);
  } catch {
    // Quota or private mode — silently ignore; in-memory state still works.
  }
}

export function clearKey(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(name));
    notify(name);
  } catch {
    // ignore
  }
}

export function subscribe(name: string, listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ key: string }>).detail;
    if (detail?.key === name) listener();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === key(name)) listener();
  };
  window.addEventListener("sct:storage", handler);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("sct:storage", handler);
    window.removeEventListener("storage", onStorage);
  };
}
